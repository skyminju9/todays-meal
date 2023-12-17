import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Fetch user list from the server
    fetch('/api/users') // Use the appropriate endpoint
      .then(response => response.json())
      .then(data => setUserList(data))
      .catch(error => console.error('Error fetching user list:', error));
  }, []);

  return (
    <div>
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
                <button>View</button>
                {/* Add a button to delete user */}
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

