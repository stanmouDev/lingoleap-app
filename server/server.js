
const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a strong secret in a real app

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('LingoLeap API is running!');
});

// --- Auth Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(sql, [username, hashedPassword], function(err) {
      if (err) {
        console.error(err); // Log the error
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ message: 'Username already exists' });
        }
        return res.status(500).json({ message: 'An error occurred while creating the user.' });
      }
      res.status(201).json({ id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});


// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Decks Routes ---

// Get all decks for a user
app.get('/api/decks', authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM decks WHERE user_id = ?';
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching decks' });
        }
        res.json(rows);
    });
});

// Create a new deck
app.post('/api/decks', authenticateToken, (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Deck name is required' });
    }
    const sql = 'INSERT INTO decks (name, user_id) VALUES (?, ?)';
    db.run(sql, [name, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error creating deck' });
        }
        res.status(201).json({ id: this.lastID, name });
    });
});


// --- Cards Routes ---

// Get all cards for a deck
app.get('/api/decks/:deckId/cards', authenticateToken, (req, res) => {
    const { deckId } = req.params;
    const sql = 'SELECT * FROM cards WHERE deck_id = ?';
    db.all(sql, [deckId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching cards' });
        }
        res.json(rows);
    });
});

// Add a card to a deck
app.post('/api/decks/:deckId/cards', authenticateToken, (req, res) => {
    const { deckId } = req.params;
    const { front, back } = req.body;
    if (!front || !back) {
        return res.status(400).json({ message: 'Front and back text are required' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const sql = 'INSERT INTO cards (front, back, deck_id, next_review_date) VALUES (?, ?, ?, ?)';
    db.run(sql, [front, back, deckId, today], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error adding card' });
        }
        res.status(201).json({
            id: this.lastID,
            front: front,
            back: back,
            deck_id: parseInt(deckId),
            next_review_date: today,
            repetition_interval: 1,
            ease_factor: 2.5
        });
    });
});

// --- Quiz & Review Routes ---

// Get all cards due for a quiz/review session
app.get('/api/decks/:deckId/quiz', authenticateToken, (req, res) => {
    const { deckId } = req.params;
    const today = new Date().toISOString().slice(0, 10);
    const sql = 'SELECT * FROM cards WHERE deck_id = ? AND next_review_date <= ?';
    db.all(sql, [deckId, today], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching cards for quiz' });
        }
        res.json(rows);
    });
});

// Review a card and update its SRS data
app.post('/api/cards/:cardId/review', authenticateToken, (req, res) => {
    const { cardId } = req.params;
    const { quality } = req.body; // Quality score from 0 to 5
    const userId = req.user.id;

    db.get('SELECT * FROM cards WHERE id = ?', [cardId], (err, card) => {
        if (err || !card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        let { ease_factor, repetition_interval } = card;

        if (quality < 3) {
            repetition_interval = 1; // Reset interval if forgotten
        } else {
            // Award XP for successful review
            db.run('UPDATE users SET experience_points = experience_points + 10 WHERE id = ?', [userId]);

            ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
            if (ease_factor < 1.3) ease_factor = 1.3;

            if (quality === 3) {
                 repetition_interval = Math.round(repetition_interval * 1);
            } else if (quality === 4) {
                 repetition_interval = Math.round(repetition_interval * ease_factor);
            } else if (quality === 5) {
                 repetition_interval = Math.round(repetition_interval * ease_factor * 1.5);
            }
        }
        
        if (repetition_interval < 1) repetition_interval = 1;

        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + repetition_interval);
        const next_review_date = nextReviewDate.toISOString().slice(0, 10);

        const sql = `UPDATE cards SET 
                        ease_factor = ?, 
                        repetition_interval = ?, 
                        next_review_date = ? 
                     WHERE id = ?`;
        
        db.run(sql, [ease_factor, repetition_interval, next_review_date, cardId], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating card review data' });
            }
            res.json({ message: 'Card review updated successfully' });
        });
    });
});

// --- Leaderboard Routes ---
app.get('/api/leaderboard', authenticateToken, (req, res) => {
    const sql = 'SELECT username, experience_points FROM users ORDER BY experience_points DESC LIMIT 10';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching leaderboard' });
        }
        res.json(rows);
    });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
