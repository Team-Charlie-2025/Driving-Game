import sqlite3
import os

from dotenv import load_dotenv

DB_PATH = os.getenv("DB_PATH", "game.db")


def init_db():
    print("calling init db")
    conn = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
    cur = conn.cursor()

    cur.execute(
        """
    CREATE TABLE IF NOT EXISTS users (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        score    INTEGER NOT NULL DEFAULT 0
    );
    """
    )
    conn.commit()

    cur.execute(
        """
    DELETE FROM users
    WHERE username LIKE '%;%' COLLATE NOCASE
       OR password LIKE '%;%' COLLATE NOCASE
       OR username LIKE '%echo%' COLLATE NOCASE
       OR password LIKE '%echo%' COLLATE NOCASE
       OR username LIKE '%swiggle%' COLLATE NOCASE
       OR password LIKE '%swiggle%' COLLATE NOCASE
       OR username LIKE '%injection%' COLLATE NOCASE
       OR password LIKE '%injection%' COLLATE NOCASE;
    """
    )
    deleted = cur.rowcount
    conn.commit()

    print(f"[init_db] deleted {deleted} nefarious user record(s)")

    conn.close()


if __name__ == "__main__":
    init_db()
    print(f"Initialized database at: {DB_PATH}")
