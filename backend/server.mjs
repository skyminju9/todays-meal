import express, { json } from 'express';
//const { json } = require('body-parser');
import { createPool } from 'mariadb';
import { hash, compare } from 'bcrypt';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 60022; 


app.use(json());
app.use(session({
  secret:'secret-key',
  resave:false,
  saveUninitialized: true,
}));

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
      'SELECT * FROM Users WHERE userid = ?',
      [userid]
    );
    conn.release();

    if (result.length > 0) {
      const user = result[0];
      const passwordMatch = await compare(password, user.password);

      if (passwordMatch) {
        // Save only user ID in the session
        req.session.user = { userid: user.userid };

        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
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

      // Create a session for the new user
      req.session.user = { name, userid };

      res.status(201).json({ success: true, message: 'Signup successful' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/getUserName', (req, res)=>{
  try{
    const userName = req.session.user && req.session.user.name;
    if(userName){
      res.status(200).json({userName});
    }else{
      res.status(404).json({error:'User name not found'});
    }
  }catch(error){
    console.error('Error getting user name : ', error);
    res.status(500).json({error:'Internal server error'});
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  try {
      // 세션 정보 클리어
      req.session.destroy((err) => {
          if (err) {
              console.error('세션 클리어 실패:', err);
              res.status(500).json({ success: false, message: 'Internal server error' });
          } else {
              res.status(200).json({ success: true, message: 'Logout successful' });
          }
      });
  } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});