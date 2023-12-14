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
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { PatientNavBar } from './../components/PatientNavBar';import Button from '@mui/material/Button';
import Prescriptions from '../components/MyPrescriptions'
import PatientTransactions from '../components/PatientTransactions';
const drawerWidth = 260;

function ViewMyInfo() {
  const { id } = useParams();
  console.log(id);
  const [show, setShow] = useState(id);

  const navigate = useNavigate();

  function goToTab(id){
    setShow(id);
    navigate(`/viewMyProfile/${id}`);
  }


  const drawer = (
    <div>
      <Toolbar />
      <List>
        {/* <ListItem key='photo' disablePadding>            
              <div style={{ textAlign: "center" , paddingLeft:'25px'}}>
                          <img src={profileImage} width='200'   alt="Image description" />
                      </div>
              
            </ListItem> */}
        <br></br>
        <Divider />
        <ListItem key='profile' disablePadding>
          <ListItemButton onClick={() => goToTab(0)}>

            <ListItemText primary='Patient Profile' />
          </ListItemButton>
        </ListItem>

        <ListItem key='healthRec' disablePadding>
          <ListItemButton onClick={() => goToTab(1)}>

            <ListItemText primary='Health Records' />
          </ListItemButton>
        </ListItem>
        <ListItem key='medhistory' disablePadding>
          <ListItemButton onClick={() => goToTab(2)}>

            <ListItemText primary='Medical History' />
          </ListItemButton>
        </ListItem>
        <ListItem key='changepass' disablePadding>
          <ListItemButton onClick={() => goToTab(3)}>

            <ListItemText primary='Change Password' />
          </ListItemButton>
        </ListItem>
        <ListItem key='FamilyMembersInfo' disablePadding>
          <ListItemButton onClick={() => goToTab(4)}>

            <ListItemText primary='FamilyMembers Information' />
          </ListItemButton>
        </ListItem>
        <ListItem key='healthPackages' disablePadding>
          <ListItemButton onClick={() => goToTab(5)}>

            <ListItemText primary='MyHealthPackages' />
          </ListItemButton>
        </ListItem>
        <ListItem key='prescription' disablePadding>
          <ListItemButton onClick={() => goToTab(6)}>

            <ListItemText primary='MyPrescriptions' />
          </ListItemButton>
        </ListItem>
        <ListItem key='transactions' disablePadding>
          <ListItemButton onClick={() => goToTab(7)}>

            <ListItemText primary='MyWallet' />
          </ListItemButton>
        </ListItem>

      </List>
      <Divider />

    </div>
  );
  return (
    require("../Styles/ViewMyInfo.css"),
    <>
      <PatientNavBar />
      <Box sx={{ display: 'flex' }}>

        <Box
          position="fixed"
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, height: '100vh', overflow: 'auto' }}
        >
          {show == 0 ? <ViewMyProfile /> : show == 1 ? <PatientRecord /> : show == 2 ? <PatientMedicalHistory /> : show == 3 ? <ChangePasswordForm /> : show == 4 ? <FamilyMember /> : show==5? <HealthPackage />: show==6?<Prescriptions/>: <PatientTransactions/>}
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
    </>
  );
}

export default ViewMyInfo;
