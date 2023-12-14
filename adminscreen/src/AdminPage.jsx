import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [adminCredentials, setAdminCredentials] = useState({
    userid: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdminCredentials({
      ...adminCredentials,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://ceprj.gachon.ac.kr:60022/admin/login', adminCredentials);

      if (response.data.success) {
        alert('Admin login successful');
        // 여기에 관리자 기능 화면으로 이동하는 코드 추가
      } else {
        alert('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <label>User ID:</label>
        <input type="text" name="userid" onChange={handleInputChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" onChange={handleInputChange} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminPage;
