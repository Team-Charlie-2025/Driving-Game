import sqlite3

conn = sqlite3.connect('leaderboard.db')  # Or your main DB
c = conn.cursor()

# Create leaderboard table
c.execute('''
    CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        coins INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')

conn.commit()
conn.close()
print("Leaderboard table created.")



