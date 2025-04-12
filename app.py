from flask_cors import CORS
from flask import Flask, request, jsonify  # Fixed import
import sqlite3
import bcrypt # type: ignore

app = Flask(__name__)
CORS(app)  # Enables CORS globally

def get_db_connection():
    conn = sqlite3.connect('game.db')  # Replace with your actual DB file name
    conn.row_factory = sqlite3.Row  # So we can access columns by name
    return conn

def init_db():
    with sqlite3.connect('game.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT UNIQUE NOT NULL,
                            password TEXT NOT NULL,
                            score INTEGER DEFAULT 0)''')
        conn.commit()

init_db()


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'success': False, 'error': 'Username and password are required'})

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')  # Decode before storing

    try:
        with sqlite3.connect('game.db') as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
            conn.commit()
        return jsonify({'success': True})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'error': 'Username already exists'})
    


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'success': False, 'error': 'Username and password are required'})

    with sqlite3.connect('game.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user[0].encode('utf-8')):
            return jsonify({'success': True, 'message': 'Login successful'})
        else:
            return jsonify({'success': False, 'error': 'Invalid username or password'})
        

@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.json
    username = data.get('username')
    new_score = data.get('score')

    if not username or new_score is None:
        return jsonify({'success': False, 'error': 'Missing username or score'})

    with sqlite3.connect('game.db') as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET score = ? WHERE username = ?", (new_score, username))
        conn.commit()

    return jsonify({'success': True, 'message': 'Score updated successfully'})



@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.get_json()
    username = data.get('username')
    score = data.get('score')

    if not username or score is None:
        return jsonify({'success': False, 'message': 'Missing data'})

    conn = sqlite3.connect('leaderboard.db')
    c = conn.cursor()
    c.execute("INSERT INTO leaderboard (username, score) VALUES (?, ?)", (username, score))
    conn.commit()
    conn.close()

    return jsonify({'success': True})


@app.route("/leaderboard")
def leaderboard():
    conn = sqlite3.connect("game.db")
    cur = conn.cursor()

    cur.execute("SELECT username, score FROM users ORDER BY score DESC")
    users = cur.fetchall()

    conn.close()

    # Return leaderboard data as JSON
    leaderboard_data = [{"username": user[0], "coins": user[1]} for user in users]
    return jsonify(leaderboard_data)



if __name__ == '__main__':
    app.run(debug=True)

