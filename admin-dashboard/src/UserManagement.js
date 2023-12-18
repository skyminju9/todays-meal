import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [userList, setUserList] = useState([]);

  const buttonstyle = {

    margin: '3px 10px',
    color: 'black',
    fontWeight: 'normal',
    fontSize: '15px',
    backgroundColor: '#e8e8e8',
    border: '1px solid black',
    width: 60,
    height: 25,
    cursor: 'pointer',

  };

  const handleDeleteUser = (userId) => {
    // Send a DELETE request to the server to delete the user
    fetch(`http://ceprj.gachon.ac.kr:60022/api/users/${userId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          // Update the user list after successful deletion
          setUserList(prevList => prevList.filter(user => user.id !== userId));
        } else {
          console.error('Error deleting user:', response.statusText);
        }
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  useEffect(() => {
    // Fetch user list from the server
    fetch('http://ceprj.gachon.ac.kr:60022/api/users') // Use the appropriate endpoint
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
            <th style={{ padding: '2px' }}>ID</th>
            <th style={{ padding: '2px' }}>Name</th>
            <th style={{ padding: '2px' }}>User ID</th>
            <th style={{ padding: '2px' }}>Push Notification Setting</th>
            <th style={{ padding: '2px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user => (
            <tr key={user.id}>
              <td style={{ padding: '2px' }}>{user.id}</td>
              <td style={{ padding: '2px' }}>{user.name}</td>
              <td style={{ padding: '2px' }}>{user.userid}</td>
              <td style={{ padding: '2px' }}>{user.pushNotificationSetting ? 'Enabled' : 'Disabled'}</td>
              <td style={{ padding: '2px' }}>
                {/* Add a button to view user details */}
                <button style={buttonstyle}>View</button>
                {/* Add a button to delete user */}
                <button style={buttonstyle} onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

