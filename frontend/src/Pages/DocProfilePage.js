import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import profileImage from "../Assets/profile.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import PaidIcon from '@mui/icons-material/Paid';
import ViewDocProfile from '../components/DocProfileInfoComponent';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ViewDocTransactions from '../components/DocTransactions';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';

const drawerWidth = 260;

function ResponsiveDrawer(props) {
const [show, setShow] = useState(0);



  const drawer = (
    <div>
      <Toolbar />
      
      <List>
      <ListItem key='photo' disablePadding>
            
             
            <div style={{ textAlign: "center" , paddingLeft:'25px'}}>
                        <img src={profileImage} width='200'   alt="Image description" />
                    </div>
            
          </ListItem>
          <br></br>
          <Divider />
        

          <ListItem key='profile' disablePadding>
            <ListItemButton  onClick={() => setShow(0)}>
              <ListItemIcon>
               <AccountCircleIcon/>
              </ListItemIcon>
              <ListItemText primary='Profile' />
            </ListItemButton>
          </ListItem>

          <ListItem key='password' disablePadding>
            <ListItemButton   onClick={() => setShow(1)}>
              <ListItemIcon>
               <PasswordIcon/>
              </ListItemIcon>
              <ListItemText primary='Password' />
            </ListItemButton>
          </ListItem>
          <ListItem key='payment' disablePadding>
            <ListItemButton   onClick={() => setShow(2)}>
              <ListItemIcon>
               <PaidIcon/>
              </ListItemIcon>
              <ListItemText primary='payment' />
            </ListItemButton>
          </ListItem>
       
      </List>
      <Divider />
      
    </div>
  );

  // Remove this const when copying and pasting into your project.

  return (
    <Box sx={{ display: 'flex'}}>
             <Box
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`,height:'100vh',overflow:'auto' }}
      >
       
         {show==0? <ViewDocProfile/>:show==1?<ChangePasswordForm/>:<ViewDocTransactions/>}
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



export default ResponsiveDrawer;
