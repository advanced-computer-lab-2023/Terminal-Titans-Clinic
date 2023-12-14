import ViewMyProfile from '../components/ViewMyProfile';
import React, { useState } from 'react';
import PatientMedicalHistory from '../components/PatientMedicalHistory';
import PatientRecord from '../components/PatientRecord';
import ChangePasswordForm from '../components/ChangePasswordForm';
import HealthPackage from "../components/HealthPackages";
import FamilyMember from '../components/FamMember';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import ViewDocInfo from '../components/ViewDocInfo';



const drawerWidth = 260;


function ViewDoctorInfo() {

 
return <ViewDocInfo/>;

return (
        <Box sx={{ display: 'flex'}}>
             <Box 
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`,height:'100vh',overflow:'auto' }}
      >                                         
        {<viewDocInfo/>} 
      </Box>

        
    </Box>             
    );

        }
    export default ViewDoctorInfo;