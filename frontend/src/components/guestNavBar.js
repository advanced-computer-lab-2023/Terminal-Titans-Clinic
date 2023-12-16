import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
// StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Dropdown from 'react-bootstrap/Dropdown';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { useEffect } from 'react';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const defaultTheme = createTheme();




export function GuestNavBar() {
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);
  // const [notifications, setNotifications] = React.useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
  }, []);

  

  
  

 

  

  const signoutButtonFunc = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/Health-Plus';
  }

  function goToChat() {
    window.location.href = `/Health-Plus/chat/${sessionStorage.getItem('token')}`;
  }

  return (
    require("../Styles/PatientNavBar.css"),
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar >
       
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <span className='homePage' >Health Plus+</span>
          </Typography>
          <nav>
           
            {/* <Link
              variant="button"
              color="text.primary"
              href="/Health-Plus/viewMyProfile"
              sx={{ my: 1, mx: 1.5 }}
            >
              Other Informations
            </Link> */}
            <Button
              className='navButton'
              variant="button"
              color="text.primary"
              // hena link el chatting
              onClick={() => {window.location.href = '/Health-Plus/signIn' }}
              sx={{ my: 1, mx: 1.5 }}
            >
              Sign in
            </Button>

            <Button
              className='navButton'
              variant="button"
              color="text.primary"
              // hena link el chatting
              onClick={() => {window.location.href = '/Health-Plus/register' }}
              sx={{ my: 1, mx: 1.5 }}
            >
              Register
            </Button>

           
          </nav>
          {/* mehtag a7ot hena el link ely hywadini 3ala el home page tani */}
          {/* <div className="signoutButton">
            <Button variant="danger" onClick={signoutButtonFunc}>Sign Out</Button>
          </div> */}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}