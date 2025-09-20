
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./lingoleap.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the lingoleap database.');
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    experience_points INTEGER DEFAULT 0
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    }
  });

  // Decks table
  db.run(`CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('Error creating decks table:', err.message);
    }
  });

  // Cards table
  db.run(`CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    deck_id INTEGER,
    repetition_interval INTEGER DEFAULT 1,
    next_review_date TEXT NOT NULL,
    ease_factor REAL DEFAULT 2.5,
    FOREIGN KEY (deck_id) REFERENCES decks (id)
  )`, (err) => {
    if (err) {
      console.error('Error creating cards table:', err.message);
    }
  });
});

module.exports = db;
