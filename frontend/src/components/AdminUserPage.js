// UserManagementPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminUserPage() {
  const [userList, setUserList] = useState([]);

  const fetchUsers = async () => {
      const response = await axios(
        {
            method: 'get',
            url: `http://localhost:8000/admin/fetchUsers`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        }).then((response) => {
            console.log(response);
            setUserList(response.data.success ? response.data.users : []);
        }).catch((error) => {
            console.error('Error fetching users:', error.message);
                });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (username) => {
    await axios(
        {
            method: 'delete',
            url: `http://localhost:8000/admin/deleteUser/${username}`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        }).then((response) => {
            alert('User successfully deleted.');
            fetchUsers(); // Refresh the user list after deletion
        }).catch((error) => {
            console.log(error);
            console.error('Error deleting user:', error.message);
            alert('Failed to delete user: ' + error.message);
        });
  };

  return (
    <div>
      <h1>User Management</h1>
      <ul>
        {userList.map((user, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            {user.Username}{' '}
            <button onClick={() => deleteUser(user.Username)}>Delete User</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUserPage;
