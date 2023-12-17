import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the user list from the server
    fetch('http://ceprj.gachon.ac.kr:60022/users') // Replace with your actual server endpoint
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleDeleteUser = (userId) => {
    // Implement the logic to delete the user on the server
    fetch(`http://ceprj.gachon.ac.kr:60022/users/${userId}`, { method: 'DELETE' }) // Replace with your actual server endpoint
      .then(response => {
        if (response.ok) {
          // Remove the deleted user from the local state
          setUsers(prevUsers => prevUsers.filter(user => user.userid !== userId));
        } else {
          console.error('Failed to delete user');
        }
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div>
      <h2>회원 관리</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>User ID</th>
            <th>Push Notification Setting</th>
            <th>User Selections</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userid}>
              <td>{user.name}</td>
              <td>{user.userid}</td>
              <td>{user.pushNotificationSetting}</td>
              <td>{user.userSelections.join(', ')}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.userid)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
