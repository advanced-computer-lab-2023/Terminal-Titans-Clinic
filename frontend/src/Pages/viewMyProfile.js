import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ViewMyProfile from '../components/ViewMyProfile';
import PatientMedicalHistory from '../components/PatientMedicalHistory';
import PatientRecord from '../components/PatientRecord';
import ChangePasswordForm from '../components/ChangePasswordForm';
import HealthPackage from '../components/HealthPackages';
import FamilyMember from '../components/FamMember';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

const drawerWidth = 260;

function ViewMyInfo() {
  const [show, setShow] = useState(0);

  const handleBackToDashboard = () => {
    window.location.href = '/Health-Plus/patientHome';
  };

  const drawer = (
    <div>
      <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
        <Button color="inherit" onClick={handleBackToDashboard} style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Dashboard
        </Button>
      </Toolbar>
      <List>
        <ListItem key='profile' disablePadding>
          <ListItemButton onClick={() => setShow(0)}>
            <ListItemText primary='Patient Profile' />
          </ListItemButton>
        </ListItem>

        <ListItem key='healthRec' disablePadding>
          <ListItemButton onClick={() => setShow(1)}>
            <ListItemText primary='Health Records' />
          </ListItemButton>
        </ListItem>
        <ListItem key='medhistory' disablePadding>
          <ListItemButton onClick={() => setShow(2)}>
            <ListItemText primary='Medical History' />
          </ListItemButton>
        </ListItem>
        <ListItem key='changepass' disablePadding>
          <ListItemButton onClick={() => setShow(3)}>
            <ListItemText primary='Change Password' />
          </ListItemButton>
        </ListItem>
        <ListItem key='FamilyMembersInfo' disablePadding>
          <ListItemButton onClick={() => setShow(4)}>
            <ListItemText primary='Family Members Information' />
          </ListItemButton>
        </ListItem>
        <ListItem key='healthPackages' disablePadding>
          <ListItemButton onClick={() => setShow(5)}>
            <ListItemText primary='My Health Packages' />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, height: '100vh', overflow: 'auto' }}
      >
        {show === 0 ? <ViewMyProfile /> : show === 1 ? <PatientRecord /> : show === 2 ? <PatientMedicalHistory /> : show === 3 ? <ChangePasswordForm /> : show === 4 ? <FamilyMember /> : <HealthPackage />}
      </Box>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default ViewMyInfo;
