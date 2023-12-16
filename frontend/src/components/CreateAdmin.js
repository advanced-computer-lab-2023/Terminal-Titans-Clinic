import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Nav from "../components/Admin-NavBar.js";

const defaultTheme = createTheme();

const CreateAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const [messageType, setMessageType] = useState('');

  const enableCreateButton = () => {
    return username.trim() !== '' && password.trim() !== '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/admin/createAdmin', {
        Username: username,
        Password: password,
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      const data = response.data;

      if (data.success) {
        setResponse("Admin "+data.Result.Username+" created successfully!");
        setMessageType('success');
        // Clear the fields after success
        setUsername('');
        setPassword('');
      } else {
        setResponse(`Error: ${data.message}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error.response.data.message);
      setResponse('Error:', error.response.data.message);
      setMessageType('error');
    }
  };

  return (
    <div>
      <Nav />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Admin Creation Form
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              {messageType && (
                <Typography variant="body1" sx={{ color: messageType === 'success' ? 'green' : 'red' }}>
                  {response}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!enableCreateButton()}
              >
                Create Admin
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default CreateAdmin;
