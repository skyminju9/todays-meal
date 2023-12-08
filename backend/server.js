import express from 'express';
import { json } from 'body-parser';
import { createPool } from 'mariadb';


const app = express();
const PORT = process.env.PORT || 60022; 
const bcrypt = require('bcrypt');

app.use(json());

// Database connection pool setup
const pool = createPool({
  host: 'localhost',
  user: 'dbid233',
  password: 'dbpass233',
  database: 'db23307',
  connectionLimit: 5,
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'SELECT * FROM Users WHERE Username = ? AND Password = ?',
      [username, password]
    );
    conn.release();

    if (result.length > 0) {
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
      const conn = await pool.getConnection();
      await conn.query('INSERT INTO Users (Username, Password) VALUES (?, ?)', [
        username,
        hashedPassword,
      ]);
      conn.release();
  
      res.status(201).json({ success: true, message: 'Signup successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
