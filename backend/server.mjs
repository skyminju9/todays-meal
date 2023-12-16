import express, {json} from 'express';
//const { json } = require('body-parser');
import {createPool} from 'mariadb';
import {hash, compare} from 'bcrypt';
import session from 'express-session';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
// import axios from 'axios';
// import { exec } from 'child_process';
// const {spawn} = require('child_process');
// const path = require('path');
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();
const PORT = process.env.PORT || 60022;

app.use(json());
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 1000 * 60 * 60 * 24},
  }),
);

// Database connection pool setup
const pool = createPool({
  host: 'localhost',
  user: 'dbid233',
  password: 'dbpass233',
  database: 'db23307',
  connectionLimit: 5,
});

async function getUserPreferences(userId) {
  try {
    const conn = await pool.getConnection();
    const results = await conn.query(
      'SELECT * FROM UserSelections WHERE userid = ?',
      [userId],
    );
    conn.release();

    if (results.length > 0) {
      const userPref = results[0];
      console.log('typeOfFood:', userPref.typeOfFood.split(', '));
      console.log('selectedData:', userPref.selectedData.split(', '));
      return {
        typeOfFood: userPref.typeOfFood.split(', '),
        selectedData: userPref.selectedData.split(', '),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.send('Hello from the backend!'); // 루트 경로로 요청이 왔을 때 "Hello from the backend!"를 응답으로 보냅니다.
});

// Login endpoint
app.post('/login', async (req, res) => {
  const {userid, password} = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM Users WHERE userid = ?', [
      userid,
    ]);
    conn.release();

    if (result.length > 0) {
      const user = result[0];
      const passwordMatch = await compare(password, user.password);

      if (passwordMatch) {
        // Save only user ID in the session
        req.session.user = {userid: user.userid, userName: user.name};
        res.status(200).json({success: true, message: 'Login successful'});
      } else {
        res.status(401).json({success: false, message: 'Invalid credentials'});
      }
    } else {
      res.status(401).json({success: false, message: 'Invalid credentials'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const {name, userid, password, pushNotificationSetting} = req.body;

  if (!name || !userid || !password) {
    res
      .status(400)
      .json({
        success: false,
        message: 'Name, userid, and password are required fields',
      });
    return;
  }

  try {
    // Check if the user with the given userid already exists
    const existingUser = await pool.query(
      'SELECT * FROM Users WHERE userid = ?',
      [userid],
    );

    if (existingUser.length > 0) {
      // User with the given userid already exists
      res
        .status(409)
        .json({success: false, message: 'User with this ID already exists'});
      return;
    }

    const hashedPassword = await hash(password, 10);
    const conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO Users (name, userid, password, pushNotificationSetting) VALUES (?, ?, ?, ?)',
      [
        name,
        userid,
        hashedPassword,
        pushNotificationSetting === undefined ? true : pushNotificationSetting,
      ],
    );
    conn.release();

    // Create a session for the new user
    req.session.user = {name, userid};

    res.status(201).json({success: true, message: 'Signup successful'});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
});

app.get('/getUserName', (req, res) => {
  try {
    const userName = req.session.user && req.session.user.userName;
    if (userName) {
      res.status(200).json({userName});
    } else {
      res.status(200).json({userName: null});
    }
  } catch (error) {
    console.error('Error getting user name:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

// Get user Id
app.get('/getUserId', (req, res) => {
  try {
    const userId = req.session.user && req.session.user.userid;
    if (userId) {
      res.status(200).json({userId});
    } else {
      res.status(200).json({userId: null});
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  try {
    // 세션 정보 클리어
    req.session.destroy(err => {
      if (err) {
        console.error('세션 클리어 실패:', err);
        res
          .status(500)
          .json({success: false, message: 'Internal server error'});
      } else {
        res.status(200).json({success: true, message: 'Logout successful'});
      }
    });
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
});

app.post('/saveUserSelections', async (req, res) => {
  const {userid, selectedTypeOfFood, selectedData} = req.body;

  try {
    const conn = await pool.getConnection();

    // Clear previous selections for the user
    await conn.query('DELETE FROM UserSelections WHERE userid = ?', [userid]);

    // Insert new selections as comma-separated strings
    const typeOfFoodString = selectedTypeOfFood.join(', ');
    const selectedDataString = selectedData.join(', ');

    await conn.query(
      'INSERT INTO UserSelections (userid, typeOfFood, selectedData) VALUES (?, ?, ?)',
      [userid, typeOfFoodString, selectedDataString],
    );

    conn.release();

    res
      .status(200)
      .json({success: true, message: 'User selections saved successfully'});
  } catch (error) {
    console.error('Error saving user selections:', error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
});

// Delete user account endpoint
app.post('/deleteAccount', async (req, res) => {
  const {userid} = req.session.user;

  try {
    const conn = await pool.getConnection();

    // Start a transaction to ensure atomicity
    await conn.beginTransaction();

    try {
      // Delete user data from UserSelections table
      await conn.query('DELETE FROM UserSelections WHERE userid = ?', [userid]);

      // Delete user data from Users table
      await conn.query('DELETE FROM Users WHERE userid = ?', [userid]);

      // Commit the transaction if all queries succeed
      await conn.commit();

      // Clear session after successful deletion
      req.session.destroy(err => {
        if (err) {
          console.error('Error clearing session:', err);
          res
            .status(500)
            .json({success: false, message: 'Internal server error'});
        } else {
          res
            .status(200)
            .json({success: true, message: 'Account deletion successful'});
        }
      });
    } catch (error) {
      // Rollback the transaction if any query fails
      await conn.rollback();
      throw error;
    } finally {
      // Release the connection
      conn.release();
    }
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
});

// Add this route after the signup endpoint
app.post('/updatePushNotificationSetting', async (req, res) => {
  const {pushNotificationSetting} = req.body;
  const {userid} = req.session.user;

  try {
    const conn = await pool.getConnection();

    // Update pushNotificationSetting in the Users table
    await conn.query(
      'UPDATE Users SET pushNotificationSetting = ? WHERE userid = ?',
      [pushNotificationSetting, userid],
    );

    conn.release();

    res
      .status(200)
      .json({
        success: true,
        message: 'Push notification setting updated successfully',
      });
  } catch (error) {
    console.error('Error updating push notification setting:', error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
});

// recommend
app.post('/recommend', async (req, res) => {
  console.log('recommend');
  console.log('Recommendation request received:', req.body);
  // try {
  const userid = req.session.user && req.session.user.userid;
  if (!userid) {
    return res
      .status(401)
      .json({success: false, message: '로그인이 필요합니다'});
  }

  const userPreferences = await getUserPreferences(userid);
  console.log('userPreferences:', userPreferences);
  if (!userPreferences) {
    return res
      .status(404)
      .json({success: false, message: 'User preferences not found'});
  }

  const scriptPath = path.join(__dirname, '../AI/recommend.py');
  const scriptArgs = [ scriptPath, userid, JSON.stringify(userPreferences)];

  const pythonProcess = spawn('python', scriptArgs);

  let scriptOutput = '';
  pythonProcess.stdout.on('data', data => {
    scriptOutput += data.toString();
  });

  pythonProcess.on('close', code => {
    if (code !== 0) {
      return res
        .status(500)
        .json({success: false, message: 'Internal server error'});
    }
    res.status(200).json({success: true, recommend: JSON.parse(scriptOutput)});
  });
});

/*
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Unauthorized access' });
  }
};

app.get('/admin', isAdmin, (req, res) => {
  res.send('Welcome to the admin dashboard!');
});
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
