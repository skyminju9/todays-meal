import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [userList, setUserList] = useState([]);

  const buttonstyle = {

    margin: '3px 10px',
    color: 'black',
    fontWeight: 'normal',
    fontSize: '15px',
    backgroundColor: 'transparent',
    border: '1px solid #e8e8e8',
    width: 40,
    height: 20,
    cursor: 'pointer',

  };

  useEffect(() => {
    // Fetch user list from the server
    fetch('/api/users') // Use the appropriate endpoint
      .then(response => response.json())
      .then(data => setUserList(data))
      .catch(error => console.error('Error fetching user list:', error));
  }, []);

  return (
    <div style={{padding:'20px'}}>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Push Notification Setting</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.userid}</td>
              <td>{user.pushNotificationSetting ? 'Enabled' : 'Disabled'}</td>
              <td>
                {/* Add a button to view user details */}
                <button style={buttonstyle}>View</button>
                {/* Add a button to delete user */}
                <button style={buttonstyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

