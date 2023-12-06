import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
// StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";


const tiers = [
  {
    title: 'Adding Admins',
    description: [
      'Work load is getting too big? Add another admin now to help you!',
      'Create an admin with ease.'
    ],
    buttonText: 'Visit',
    buttonVariant: 'contained',
  },
  {
    title: 'HealthPackages',
    description: [
      'Manage Health Care Packages with ease through this page.',
      'View, add, update and delete Packages on the spot.'
    ],
    buttonText: 'Visit',
    buttonVariant: 'contained',
  },
  {
    title: 'Doctor Applications',
    description: [
      'Manage Doctor Applications with a click of a button.',
      'View, accept or reject Doctor Applications.'
    ],
    buttonText: 'Visit',
    buttonVariant: 'contained',
  },
  {
    title: 'Users List',
    description: [
      'Manage every user conveniently through this page.',
    ],
    buttonText: 'Visit',
    buttonVariant: 'contained',
  },
];
function getLinkForTier(title) {
  switch (title) {
    case 'Users List':
      return '/admin';
    case 'HealthPackages':
      return '/admin';
    case 'Doctor Applications':
      return '/docApplicationList';
    case 'Adding Admins':
      return '/admin';
    default:
      return '/';
  }
}




// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Pricing() {
  const navigate = useNavigate();

  return (
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
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Health Plus+
          </Typography>
          <nav>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Visit pharmacy
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="/Health-Plus/viewMyProfile"
              sx={{ my: 1, mx: 1.5 }}
            >
              Other Informations
            </Link>
            <Link
              variant="button"
              color="text.primary"
              // hena link el chatting
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Support
            </Link>
          </nav>
          {/* mehtag a7ot hena el link ely hywadini 3ala el home page tani */}
          <Button href="#" variant="contained" sx={{ my: 1, mx: 1.5 }}> 
            Home
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
              Your Admin Dashboard
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
        Manage the Clinic efficiently with our admin dashboard.
        Manage users, health packages, doctor applications and more in one place. 
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
              {tiers.map((tier) => (
        <Grid
          item
          key={tier.title}
          xs={12}
          md={4}
        >
          <Card>
            <CardHeader
              title={tier.title}
              subheader={tier.subheader}
              titleTypographyProps={{ align: 'center' }}
              subheaderTypographyProps={{
                align: 'center',
              }}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[200]
                    : theme.palette.grey[700],
              }}
            />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'baseline',
                  mb: 2,
                }}
              />
              <ul>
                {tier.description.map((line) => (
                  <Typography
                    component="li"
                    variant="subtitle1"
                    align="center"
                    key={line}
                  >
                    {line}
                  </Typography>
                ))}
              </ul>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant={tier.buttonVariant}
                style={{ background:'black' }}
                onClick={() => {
                  if (tier.title !== "Doctor Applications") {
                    alert("This page is still under maintenance");
                  }else{
                    navigate(getLinkForTier(tier.title));
                  }
                }}
                >
              <Link
                style={{ textDecoration: 'none', color: 'white' }}
              >
                {tier.buttonText}
               </Link>
              </Button>
            </CardActions>
           </Card>
          </Grid>
          ))}

        </Grid>
      </Container>
    </ThemeProvider>
  );
}