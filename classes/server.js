


const express = require('express');   //web framework for Node.js to handale HTTP requests and responses ( LIKE GET, POST)
const sqlite3 = require('sqlite3').verbose(); //Library to interact with SQLite databases
const bcrypt = require('bcrypt');//Password hashing library to securely store passwords
const bodyParser = require('body-parser'); //Middleware to parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors'); //Middleware to enable Cross-Origin Resource Sharing (CORS) for your API

const app = express(); //Create an instance of the Express application
const db = new sqlite3.Database('./game_leaderboard.db'); 
const PORT = 5500;  //Port number for the server to listen on

app.use(cors());
app.use(bodyParser).json();

// Sign Up Endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
    if (err) return res.status(500).send({ message: 'User already exists!' });
    res.status(200).send({ message: 'Signup successful!' });
  });
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ message: 'Invalid credentials!' });
    }
    res.status(200).send({ message: 'Login successful!', userId: user.id });
  });
});

// Leaderboard Endpoint
app.get('/leaderboard', (req, res) => {
  db.all('SELECT username, score FROM users JOIN scores ON users.id = scores.user_id ORDER BY score DESC LIMIT 10', [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(rows);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
