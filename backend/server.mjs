import express, { json } from 'express';
//const { json } = require('body-parser');
import { createPool } from 'mariadb';
import { hash } from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 60022; 


app.use(json());

// Database connection pool setup
const pool = createPool({
  host: 'localhost',
  user: 'dbid233',
  password: 'dbpass233',
  database: 'db23307',
  connectionLimit: 5,
});

app.get('/', (req, res) => {
    res.send('Hello from the backend!'); // 루트 경로로 요청이 왔을 때 "Hello from the backend!"를 응답으로 보냅니다.
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { userid, password } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'SELECT * FROM Users WHERE userid = ? AND password = ?',
        [userid, password]
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
    const { name, userid, password, pushNotificationSetting } = req.body;

    if (!name || !userid || !password) {
      res.status(400).json({ success: false, message: 'Name, userid, and password are required fields' });
      return;
    }

    try {
        // Check if the user with the given userid already exists
        const existingUser = await pool.query('SELECT * FROM Users WHERE userid = ?', [userid]);

        if (existingUser.length > 0) {
            // User with the given userid already exists
            res.status(409).json({ success: false, message: 'User with this ID already exists' });
            return;
        }

        const hashedPassword = await hash(password, 10);
        const conn = await pool.getConnection();
        await conn.query(
            'INSERT INTO Users (name, userid, password, pushNotificationSetting) VALUES (?, ?, ?, ?)',
            [name, userid, hashedPassword, pushNotificationSetting === undefined ? true : pushNotificationSetting]
        );
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