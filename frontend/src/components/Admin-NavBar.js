import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
// StarIcon from '@mui/icons-material/StarBorder';
import GlobalStyles from '@mui/material/GlobalStyles';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


// TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

export default function Pricing() {

  function changePassword() {
  }


  function goToHome() {
    window.location.href = `http://localhost:3000/Health-Plus/admin`
  }

  const signoutButtonFunc = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/Health-Plus';
  }

  return (
    // require("../Styles/pharmacistNavBar.css"),
    // <ThemeProvider theme={defaultTheme}>
    <div>
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
              onClick={() => { changePassword() }}
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