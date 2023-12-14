import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// StarIcon from '@mui/icons-material/StarBorder';
import React, { useEffect, useState } from 'react';

import GlobalStyles from '@mui/material/GlobalStyles';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Modal from 'react-bootstrap/Modal';
import validator from 'validator';
import "../Styles/AdminScreen.css";




// TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

export default function Pricing() {
  const [modalShow, setModalShow] = React.useState(false);

  function goToHome() {
    window.location.href = `http://localhost:3000/Health-Plus/admin`
  }

  const signoutButtonFunc = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/Health-Plus';
  }

  return (
    require("../Styles/AdminScreen.css"),
    // <ThemeProvider theme={defaultTheme}>
    <div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Health Plus+
          </Typography>
          <nav>

            <Link>
              <Button
                style={{ color: 'black' , backgroundColor: 'rgb(220, 220, 220)'}}
                onClick={() => { goToHome() }}
                sx={{ my: 1, mx: 1.5 }}
                >
                Home Page
              </Button>
            </Link>
            <Button
              variant="button"
              style={{ color: 'black' , backgroundColor: 'rgb(220, 220, 220)'}}
              color="text.primary"
              onClick={() => { setModalShow(true) }}
              sx={{ my: 1, mx: 1.5 }}
            >
              Change Password
            </Button>
          </nav>

          <Button style={{ backgroundColor: 'rgb(220, 220, 220)'}} onClick={signoutButtonFunc}>Sign Out</Button>
        </Toolbar>
      </AppBar>
      </div>
    // </ThemeProvider>
  );
}

function MyVerticallyCenteredModal(props) {
  const [oldPassword, setoldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessagePass, setErrorMessagePass] = useState('')
  const validatePass = (value) => {
    setPassword(value);
    if (value !== '' && validator.isStrongPassword(value, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 0
    })) {
      setErrorMessagePass('Is Strong Password')
    } else {
      setErrorMessagePass('Password has to be 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number ')
    }
  }
  const changePassword = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { password, oldPassword };

    fetch('http://localhost:8000/security/changePassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem("token") },
      body: JSON.stringify(data),
    }).then((response) => response.json()).then(data => {
      console.log(data);
      if (data.success) {
        alert("Password Changed Successfully")
        sessionStorage.removeItem('token');
        window.location.href = 'http://localhost:3000/Health-Plus/admin';
      }
      else {
        alert(data.message)
      }
    })
      .catch((error) => {

        console.error('Error:', error);
        alert(error.response.data.message)

      });
    // Make a POST request to your backend register route
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className='admin-header' closeButton>
        <Modal.Title className='admin-header-cross' id="contained-modal-title-vcenter">
          Change Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Enter your new Password</h4>
        <label htmlFor="oldPassword">Old Password:</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setoldPassword(e.target.value)}></input>

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => validatePass(e.target.value)}></input> <br />
        {errorMessagePass && <p className={errorMessagePass !== 'Is Strong Password'?'error-msg':''}>{errorMessagePass}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button variant="success" className={errorMessagePass !== 'Is Strong Password'?'fail-button':'success-button'} onClick={changePassword} disabled={errorMessagePass !== 'Is Strong Password'} style={{}} >Update Password</Button>
      </Modal.Footer>
    </Modal>
  );
}