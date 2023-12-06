import ViewMyProfile from '../components/ViewMyProfile';
import React, { useState, useEffect } from 'react';
import PatientMedicalHistory from '../components/PatientMedicalHistory';
import PatientRecord from '../components/PatientRecord';
import ChangePasswordForm from '../components/ChangePasswordForm';
import HealthPackage from "../components/HealthPackages";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';



const drawerWidth = 260;

function ViewMyInfo() {
    const [show, setShow] = useState(0);
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
              <ListItemButton  onClick={() => setShow(0)}>
                
                <ListItemText primary='Patient Profile' />
              </ListItemButton>
            </ListItem>
  
            <ListItem key='healthRec' disablePadding>
              <ListItemButton   onClick={() => setShow(1)}>
               
                <ListItemText primary='Health Records' />
              </ListItemButton>
            </ListItem>
            <ListItem key='medhistory' disablePadding>
              <ListItemButton   onClick={() => setShow(2)}>
                
                <ListItemText primary='Medical History' />
              </ListItemButton>
            </ListItem>
            <ListItem key='changepass' disablePadding>
              <ListItemButton   onClick={() => setShow(3)}>
                
                <ListItemText primary='Change Password' />
              </ListItemButton>
            </ListItem>
            <ListItem key='FamilyMembersInfo' disablePadding>
              <ListItemButton   onClick={() => setShow(4)}>
                
                <ListItemText primary='FamilyMembers Information' />
              </ListItemButton>
            </ListItem>
            <ListItem key='healthPackages' disablePadding>
              <ListItemButton   onClick={() => setShow(5)}>
                
                <ListItemText primary='MyHealthPackages' />
              </ListItemButton>
            </ListItem>
         
        </List>
        <Divider />
        
      </div>
    );
    return (
        <Box sx={{ display: 'flex'}}>
             <Box
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`,height:'100vh',overflow:'auto' }}
      >                                         
         {show==0? <ViewMyProfile/>:show==1?<PatientRecord/>:show==2?<PatientMedicalHistory/>:show==3?<ChangePasswordForm/>:show==4?<ViewMyProfile/>:<HealthPackage/>}
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