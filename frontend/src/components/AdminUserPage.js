import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import UserInfoPopup from './ViewUserPopup'; // Import the new popup component
import Nav from "../components/Admin-NavBar.js";


function AdminUserPage() {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // New state for selected user
  const [popupVisible, setPopupVisible] = useState(false); // New state for popup visibility

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/admin/fetchUsers`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      console.log(response.data);
      setUserList(response.data.users);
    } catch (error) {
      setUserList([]);
      alert('Error fetching Users');
      console.error('Error fetching users:', error.message);
    }
  };

  const deleteUser = async (username) => {
    try {
      await axios({
        method: 'delete',
        url: `http://localhost:8000/admin/deleteUser/${username}`,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      alert('User successfully deleted.');
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error.message);
      alert('Failed to delete user: ' + error.message);
    }
  };

  const openUserInfoPopup = (user) => {
    setSelectedUser(user);
    setPopupVisible(true);
  };

  const closeUserInfoPopup = () => {
    setSelectedUser(null);
    setPopupVisible(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Nav/>
    <div>
      <div style={{ width: '100%', padding: '10px' }}>
        <h1 style={{ color: 'white', textAlign: 'center', backgroundColor: 'black', borderRadius: '15px' }}>
          User Management Page
        </h1>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {userList.map((user, index) => (
          <UserCard key={index} user={user} onDelete={deleteUser} onViewInfo={() => openUserInfoPopup(user)} />
        ))}
      </div>

      {/* Render the popup conditionally */}
      {popupVisible && <UserInfoPopup user={selectedUser} onClose={closeUserInfoPopup} />}
    </div>
    </div>
  );
}

export default AdminUserPage;
