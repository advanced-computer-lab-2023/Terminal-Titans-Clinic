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



export function DoctorNavBar() {
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);
  const location = useLocation();
  const navigate = useNavigate();


  // const [notifications, setNotifications] = React.useState([]);
console.log(location.pathname)
  useEffect(() => {
    getNotifications();
    connectToWs();
  }, []);

  async function getNotifications() {
    const response = await axios('http://localhost:8000/notification/unReadNotifications', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    console.log(response.data);
    setNotificationsCount(response.data.length);
  }

  function goToNotification() {
    window.location.href = '/Health-Plus/notifications/Doctor';
  }

  function connectToWs() {
    const ws = new WebSocket('ws://localhost:8000');
    ws.onopen = () => {
      ws.send(JSON.stringify({ token: sessionStorage.getItem('token') }));
    };
    ws.addEventListener('message', handleNotifications);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected. Trying to reconnect.');
        connectToWs();
      }, 1000);
    });
  }

  function handleNotifications(event) {
    const data = JSON.parse(event.data);
    // notifications
    if (data.type === 'notification' && notifications.findIndex((notification) => notification == data?._id?.toString()) === -1) {
      console.log('notification received');
      setNotificationsCount((prev) => prev + 1);
      setNotifications((prev) => [...prev, data._id]);
      // console.log(data.myNotification.Message);
      // setNotifications((prev) => [...prev, data.myNotification.Message]);
    }
  }

  const signoutButtonFunc = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/Health-Plus';
  }

  function goToChat() {
    window.location.href = `/Health-Plus/chat/${sessionStorage.getItem('token')}`;
  }
    function goBack(){
      
    console.log(location.pathname.substring(0,15))
    if(location.pathname.substring(0,15)==='/viewDocProfile'){
      
      window.location.href = '/Health-Plus/doctorHome';
      return;      
    }
    navigate(-1);

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
        
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          {location.pathname!=='/doctorHome'?
           <Button
           // hena link el chatting
           style={{ color: 'black' }}
           onClick={() => { goBack() }}
                      sx={{ my: 1, mx: 0 }}
                      size="small"
         >
             <ArrowBackIosIcon />
           
         </Button>
         
            :null}
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <span className='homePage' onClick={() => { window.location.href = '/Health-Plus/doctorHome' }}>Health Plus+</span>
          </Typography>
          <nav>
            {/* <Button
              className='navButton'
              variant="button"
              color="text.primary"
              onClick={() => { window.location.href = '/Health-Plus/prescriptions' }}
              sx={{ my: 1, mx: 1.5 }}
            >
              Visit pharmacy
            </Button> */}
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
              onClick={() => { navigate('/acceptRejectFollowUp') }}
              sx={{ my: 1, mx: 1.5 }}
            >
              Follow up requests
            </Button>
            <Button
              className='navButton'
              variant="button"
              color="text.primary"
              // hena link el chatting
              onClick={() => { navigate('/addAvailableSlots') }}
              sx={{ my: 1, mx: 1.5 }}
            >
              Add Time Slot
            </Button>
            <Button
              className='navButton'
              variant="button"
              color="text.primary"
              // hena link el chatting
              onClick={() => { goToChat() }}
              sx={{ my: 1, mx: 1.5 }}
            >
              Support
            </Button>

            <Button
              // hena link el chatting
              style={{ color: 'black' }}
              onClick={() => { goToNotification() }}
              sx={{ my: 1, mx: 1.5 }}
            >
              <Badge color="warning" badgeContent={notificationsCount} showZero>
                <MailIcon />
              </Badge>
            </Button>

            <Dropdown className="d-inline mx-2">
              <Dropdown.Toggle id="dropdown-autoclose-true">
                <Avatar src="/broken-image.jpg" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/Health-Plus/viewDocProfile/0">My Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/Health-Plus/viewDocProfile/1">Change Password</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/Health-Plus/viewDocProfile/2">Wallet</Dropdown.Item>
                
                <Dropdown.Divider />
                <Dropdown.Item onClick={signoutButtonFunc}>Sign Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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