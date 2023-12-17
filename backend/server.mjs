import express, {json} from 'express';
//const { json } = require('body-parser');
import {createPool} from 'mariadb';
import {hash, compare} from 'bcrypt';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import {spawn} from 'child_process';
import {fileURLToPath} from 'url';
import cors from 'cors';
// import axios from 'axios';

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

app.use(cors());

// Database connection pool setup
const pool = createPool({
  host: 'localhost',
  user: 'dbid233',
  password: 'dbpass233',
  database: 'db23307',
  connectionLimit: 5,
});

const corsOptions = {
  origin: 'http://ceprj.gachon.ac.kr:60022', // 클라이언트의 도메인 (허용하고 싶은 도메인)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // 인증 정보 (쿠키 등)를 전송하려면 true로 설정
  optionsSuccessStatus: 204, // preflight 요청에 대한 응답 상태 코드
};

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

// 마지막 추천 시각 업데이트
async function updateLastRecommendationTime(userId) {
  try {
    const conn = await pool.getConnection();
    const now = new Date();
    await conn.query('UPDATE Users SET updateTime = ? WHERE userid = ?', [now, userId]);
    conn.release();
  } catch (error) {
    console.error('Error updating last recommendation time:', error);
    throw error;
  }
}
//마지막 추천 시간 조회
async function getLastRecommendationTime(userId) {
  try {
    const conn = await pool.getConnection();
    const query = 'SELECT updateTime FROM Users WHERE userid = ?';
    const result = await conn.query(query, [userId]);
    conn.release();

    if (result.length > 0 && result[0].lastRecommendationTime) {
      // 데이터베이스에서 조회한 시간을 JavaScript Date 객체로 변환
      return new Date(result[0].lastRecommendationTime);
    } else {
      // 추천 받은 기록이 없는 경우 null 반환
      return null;
    }
  } catch (error) {
    console.error('Error fetching last recommendation time:', error);
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
    res.status(400).json({
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

    res.status(200).json({
      success: true,
      message: 'Push notification setting updated successfully',
    });
  } catch (error) {
    console.error('Error updating push notification setting:', error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
});

// Bookmark
app.post('/bookmark', async (req, res) => {
  const { recipeid } = req.body;
  const userid = req.session.user && req.session.user.userid;

  if (!userid) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다' });
  }

  try {
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO BookmarkedRecipes (userid, recipeid) VALUES (?, ?)', [userid, recipeid]);
    conn.release();

    res.status(200).json({ success: true, message: 'Bookmark added successfully' });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Bookmark delete
app.delete('/deleteBookmark/:recipeid', async (req, res) => {
  const recipeid = req.params.recipeid;
  const userid = req.session.user && req.session.user.userid;

  if (!userid) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다' });
  }

  try {
    const conn = await pool.getConnection();
    // 해당 사용자의 북마크만 삭제
    const result = await conn.query('DELETE FROM BookmarkedRecipes WHERE recipeid = ? AND userid = ?', [recipeid, userid]);
    conn.release();
    
    if (result.affectedRows === 0) {// 북마크가 없는 경우
      res.status(404).json({ success: false, message: 'Bookmark not found' });
    } else {// 삭제 성공
      res.status(200).json({ success: true, message: 'Bookmark deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get bookmarks
app.get('/getBookmarks', async (req, res) => {
  const userid = req.session.user && req.session.user.userid;

  if (!userid) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다' });
  }

  try {
    const conn = await pool.getConnection();
    const bookmarks = await conn.query('SELECT recipeid FROM BookmarkedRecipes WHERE userid = ?', [userid]);
    conn.release();
    // recipes.json 파일 읽기
    const recipesFilePath = path.join(__dirname, '../recipes.json');
    const recipesData = JSON.parse(fs.readFileSync(recipesFilePath, 'utf8'));

    // 북마크된 레시피 정보 찾기
    const bookmarkedRecipes = bookmarks.map(bookmark => recipesData.find(recipe => recipe.id === bookmark.recipeid));

    res.status(200).json({ success: true, bookmarks: bookmarkedRecipes });
    } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ success: false, message: 'Internal server error' }); 
}
});

// recommend
app.post('/recommend', async (req, res) => {
  console.log('Recommendation request received:', req.body);
  
  const userid = req.session.user && req.session.user.userid;
  if (!userid) {
    return res
      .status(401)
      .json({success: false, message: '로그인이 필요합니다'});
  }

  // 사용자의 마지막 추천 시간을 확인
  const lastRecommendationTime = await getLastRecommendationTime(userid);
  const currentTime = new Date();

  // 마지막 추천 시간과 현재 시간을 비교(24시간 이내인지 확인)
  if (lastRecommendationTime && currentTime - lastRecommendationTime < 86400000) {
    return res
      .status(200)
      .json({success: true, message: '이미 오늘의 추천을 받았습니다'});
  }

  const userPreferences = await getUserPreferences(userid);
  console.log('userPreferences:', userPreferences);
  if (!userPreferences) {
    return res
      .status(404)
      .json({success: false, message: 'User preferences not found'});
  }

  // 추천 알고리즘을 실행
  const scriptPath = path.join(__dirname, '../AI/recommend.py');
  const scriptArgs = [scriptPath, userid, JSON.stringify(userPreferences)];

  const pythonProcess = spawn('python', scriptArgs);

  let scriptOutput = '';
  pythonProcess.stdout.on('data', data => {
    scriptOutput += data.toString();
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({success: false, message: 'Internal server error'});
    }
    try {
      // JSON 파싱 시도
      const parsedOutput = JSON.parse(scriptOutput);
      // 마지막 추천 시간을 업데이트
      await updateLastRecommendationTime(userid);
      res.status(200).json({success: true, recommend: parsedOutput.name});
    } catch (error) {
      // JSON 파싱 중 오류가 발생했을 때 처리
      console.error('JSON 파싱 오류:', error);
      res.status(500).json({success: false, message: 'JSON parsing error'});
    }
  });
});

// New endpoint to get the list of users
app.get('/users', (req, res) => {
  const query = 'SELECT id, name, userid, pushNotificationSetting FROM Users';
  pool.query(query)
    .then((results) => {
      res.json(results);
    })
    .catch((error) => {
      console.error('Error fetching user list:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM Users WHERE id = ?';
  pool.query(query, [userId])
    .then(() => {
      res.json({ message: 'User deleted successfully' });
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// 정적 파일을 제공하기 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'build')));

// /todaysmeal 엔드포인트에 MainPage.js를 제공
app.get('/todaysmeal', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/admin-login', (req, res) => {
  const { username, password } = req.body;

  // 여기에서 실제 로그인 로직을 구현합니다.
  // 예를 들어, 하드코딩된 관리자 계정을 사용하여 간단히 확인하는 예시입니다.
  if (username === 'admin' && password === 'admin123') {
    res.status(200).json({ success: true, message: '로그인 성공' });
  } else {
    res.status(401).json({ success: false, message: '로그인 실패' });
  }
});

app.get('/admin-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
