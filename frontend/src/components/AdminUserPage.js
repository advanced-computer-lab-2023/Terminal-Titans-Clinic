import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import {IconButton } from '@mui/material';
import { Container, Grid } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Nav from "../components/Admin-NavBar.js";
import { Scrollbar } from '../overview/scrollbar';
import UserInfoPopup from './ViewUserPopup'; // Import the new popup component
import { Paper } from '@mui/material';
import '../Styles/Admin.css';



const statusMap = {
  rescheduled: 'warning',
  upcoming: 'info',
  completed: 'success',
  cancelled: 'error'
};

function AdminUserPage() {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/admin/fetchUsers`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
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
    <div >
      <Nav/>
      <div style={{ width: '100%', padding: '10px' }}>
        <h1 style={{ color: 'white',textAlign: 'center', backgroundColor: 'black', borderRadius: '15px' }}>
          User Management Page
        </h1>
      </div>
      <Box
        component="main"
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
      <Paper elevation={0} sx={{ }}>
          <Container>
            <Grid container>

            <Grid item  >
            <Card style={{ width: '100%', height: '100%' }}>
        <CardHeader title="User List" />
        <Divider />
        <Scrollbar sx={{ flexGrow: 1 }}>
          <Box sx={{ }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">User Type</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.map((user, index) => (
                  <TableRow hover key={index}>
                    <TableCell align="center">{user.Username}</TableCell>
                    <TableCell align="center">{user.__t}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        endIcon={(
                          <SvgIcon fontSize="small">
                            <ArrowRightIcon />
                          </SvgIcon>
                        )}
                        onClick={() => openUserInfoPopup(user)}
                        style={{ backgroundColor: 'black', fontSize: 'medium', color: 'white', borderRadius: '5px', padding: '6px' }}
                      >
                        View User Info
                      </IconButton>
                      <IconButton color="error" onClick={() => deleteUser(user.Username)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
                  
                  
                
      </Grid>
            </Grid> 
          </Container>
        </Paper>
        </Box>

      

      {popupVisible && <UserInfoPopup user={selectedUser} onClose={closeUserInfoPopup} />}
    </div>
  );
}

export default AdminUserPage;
