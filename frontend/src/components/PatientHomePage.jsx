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
import { PatientNavBar } from './PatientNavBar.jsx';
import { useNavigate } from 'react-router-dom';


const tiers = [
  {
    title: 'Doctors',
    description: [
      'View our  skilled doctors and their specialized fields.',
      'Book appointments effortlessly at competitive prices.',
    ],
    buttonText: 'Visit',
    buttonVariant: 'contained',
  },
  {
    title: 'HealthPackages',
    description: [
      'Discover various health packages tailored to your needs from here.',
      'Get comprehensive health checkups and insights for a healthier life.'
    ],
    buttonText: 'Visit',
    buttonVariant: 'contained',
  },
  {
    title: 'Appointments',
    description: [
      'Schedule and manage your appointments seamlessly.',
      'Stay on top of your health with easy access to appointment details and reminders.'
    ],
    buttonText: 'Visit',
    buttonVariant: 'contained',
  },
];



const defaultTheme = createTheme();

export default function Pricing() {

  const navigate = useNavigate();

  function getLinkForTier(title) {
    console.log(title);
    switch (title) {
      case 'Prescriptions':
        return navigate('/prescriptions');
      case 'HealthPackages':
        return navigate('/packageSubscribtion');
      case 'Appointments':
        return navigate('/viewAppointments');
      default:
        return '/';
    }
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <PatientNavBar />
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Your Patient Dashboard
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          View our  skilled doctors and their specialized fields. Book appointments effortlessly at competitive prices.
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
                    onClick={() => { getLinkForTier(tier.title) }}
                  >
                    {tier.buttonText}
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