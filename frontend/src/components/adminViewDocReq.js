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
import ViewDocProfile from './DocProfileInfoComponent';
import ChangePasswordForm from './ChangePasswordForm';
import ViewDocTransactions from './DocTransactions';
import AcceptRejectDoctor from './viewRegDocDoc';
import Nav from "../components/Admin-NavBar.js";



const drawerWidth = 260;

function ResponsiveDrawer(props) {
const [show, setShow] = useState(0);




  // Remove this const when copying and pasting into your project.

  return (
    <div>
      <Nav/>
    <Box sx={{display: 'grid' }}>
    <Box
        position = 'inherit'
        justifySelf='center'
>
       
         {<AcceptRejectDoctor/>}
      </Box>
        
        
    </Box>
  </div>
  );
}



export default ResponsiveDrawer;
