import os
import re
import sqlite3
from init_db import init_db
from datetime import datetime, timedelta

from flask import Flask, request, jsonify, g
from flask_cors import CORS
import bcrypt
import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
DB_PATH = os.getenv("DB_PATH")
CORS_ORIGIN = os.getenv("CORS_ORIGIN")

USERNAME_RE = os.getenv("USERNAME_RE")
PASSWORD_MIN = os.getenv("PASSWORD_MIN")
PASSWORD_MAX = os.getenv("PASSWORD_MAX")
SCORE_MIN = os.getenv("SCORE_MIN")
SCORE_MAX = os.getenv("SCORE_MAX")

app = Flask(__name__)
app.config["JWT_ALGO"] = "HS256"
CORS(app)
# , origins=[CORS_ORIGIN])


def get_db():
    if "db" not in g:
        conn = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        g.db = conn
    return g.db


@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def validate_username(u: str) -> bool:
    return bool(USERNAME_RE.fullmatch(u))


def validate_password(p: str) -> bool:
    return isinstance(p, str) and len(p) >= PASSWORD_MIN and len(p) <= PASSWORD_MAX


def make_token(username: str) -> str:
    payload = {
        "sub": username,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=24),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=app.config["JWT_ALGO"])


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[app.config["JWT_ALGO"]])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def auth_required(fn):
    from functools import wraps

    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", None)
        if not auth or not auth.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        token = auth.split(None, 1)[1]
        data = decode_token(token)
        if not data:
            return jsonify({"error": "Invalid or expired token"}), 401
        g.current_user = data["sub"]
        return fn(*args, **kwargs)

    return wrapper


init_db()


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    u = data.get("username", "")
    p = data.get("password", "")

    if not (validate_username(u) and validate_password(p)):
        return jsonify({"error": "Invalid username or password format"}), 400

    hashed = bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()
    db = get_db()
    try:
        db.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (u, hashed),
        )
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 409

    token = make_token(u)
    return jsonify({"message": "Account created", "access_token": token}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    u = data.get("username", "")
    p = data.get("password", "")

    if not (validate_username(u) and validate_password(p)):
        return jsonify({"error": "Invalid credentials"}), 400

    db = get_db()
    row = db.execute("SELECT password FROM users WHERE username = ?", (u,)).fetchone()

    if row and bcrypt.checkpw(p.encode(), row["password"].encode()):
        token = make_token(u)
        return jsonify({"message": "Login successful", "access_token": token})
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@app.route("/submit_score", methods=["POST"])
@auth_required
def submit_score():
    data = request.get_json() or {}
    u = g.current_user

    try:
        score = int(data.get("score", None))
    except (TypeError, ValueError):
        return jsonify({"error": "Score must be an integer"}), 400
    if score < SCORE_MIN:
        return jsonify({"error": "Score must be ≥ 0"}), 400
    elif score > SCORE_MAX:
        return jsonify({"Score too high, likely invalid."})

    db = get_db()
    row = db.execute("SELECT score FROM users WHERE username = ?", (u,)).fetchone()

    if row is None:
        return jsonify({"error": "User not found"}), 404

    if score > row["score"]:
        db.execute(
            "UPDATE users SET score = ? WHERE username = ?",
            (score, u),
        )
        db.commit()

    return jsonify({"message": "Score recorded"}), 200


@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    db = get_db()
    rows = db.execute(
        "SELECT username, score FROM users ORDER BY score DESC LIMIT 100"
    ).fetchall()

    return (
        jsonify([{"username": r["username"], "score": r["score"]} for r in rows]),
        200,
    )


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=9411, debug=False)
