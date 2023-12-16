
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { OverviewTotalCustomers } from '../overview/overview-total-customers';
import { OverviewTotalSales } from '../overview/overview-total-sales';
import { OverviewOrdersProgress } from '../overview/overview-orders-progress';
import { OverviewSales } from '../overview/overview-sales';
import { OverviewLatestUsers } from '../overview/overview-latest-users';
import { OverviewLatestMedicines } from '../overview/overview-latest-medicines';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import { Button } from '@mui/material';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import AdminNavBar from '../components/Admin-NavBar';
import { styled } from '@mui/material/styles';

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: '100%',
}));

const AdminHomePage = () => {

  const navigate = useNavigate();

  return (
    require('../Styles/Admin.css'),
    <>
      <AdminNavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,

        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
            >
              <Item>
                <OverviewTotalCustomers
                  item
                  positive={true}
                  sx={{ height: '100%' }}
                />
              </Item>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
            >
              <Item>
                <OverviewOrdersProgress
                  sx={{ height: '100%' }}
                  value={75.5}
                />
              </Item>
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <Item>
                <OverviewTotalSales
                  sx={{ height: '100%' }}
                  value="$15k"
                />
              </Item>
            </Grid>

            <Grid
              xs={12}
              lg={8}
            >
              <OverviewSales
                salesType={'year'}
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid
              xs={12}
              md={6}
              lg={4}
            >
              <OverviewSales
                salesType={'week'}
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid
              xs={12}
              md={6}
              lg={4}
            >
              <OverviewLatestMedicines
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid
              xs={12}
              md={12}
              lg={8}
            >
              <OverviewLatestUsers
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
            >
              <Item>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack
                      alignItems="flex-start"
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Stack spacing={1}>
                        <Typography
                          color="text.secondary"
                          variant="overline"
                        >
                          Add Admin
                        </Typography>
                        <Typography variant="p">
                          Work load is getting too big? Add another admin to help you out!
                        </Typography>
                      </Stack>
                      <Avatar
                        sx={{
                          backgroundColor: 'success.main',
                          height: 56,
                          width: 56
                        }}
                      >
                        <SvgIcon>
                          <AdminPanelSettingsIcon />
                        </SvgIcon>
                      </Avatar>
                    </Stack>

                    <Button variant="contained" style={{ width: '100%' }} className='flex text-center mt-4' color='success' onClick={() => navigate('/createAdmin')}>
                      Add Admin
                    </Button>

                  </CardContent>
                </Card>
              </Item>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
            >
              <Item>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack
                      alignItems="flex-start"
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Stack spacing={1}>
                        <Typography
                          color="text.secondary"
                          variant="overline"
                        >
                          Review Applications
                        </Typography>
                        <Typography variant="p">
                          Review applications from doctors and pharmacists who want to join your clinic.
                        </Typography>
                      </Stack>
                      <Avatar
                        sx={{
                          backgroundColor: 'error.main',
                          height: 56,
                          width: 56
                        }}
                      >
                        <SvgIcon>
                          <PeopleIcon />
                        </SvgIcon>
                      </Avatar>
                    </Stack>

                    <div className='flex justify-content-center' style={{ gap: '2rem' }}>
                      <Button variant="contained" className='flex text-center mt-4' color='error' onClick={() => navigate('/docApplicationList')}>
                        Doctors Applications
                      </Button>

                      <Button variant="contained" className='flex text-center mt-4' color='error' onClick={() => window.location.href(`http://localhost:4000/Health-Plus/adminPharmApplicationList?id=${sessionStorage.getItem('token')}`)}>
                        Pharmacists Applications
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </Item>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
            >
              <Item>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack
                      alignItems="flex-start"
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Stack spacing={1}>
                        <Typography
                          color="text.secondary"
                          variant="overline"
                        >
                          Health Packages
                        </Typography>
                        <Typography variant="p">
                          Manage health packages and their prices.
                        </Typography>
                      </Stack>
                      <Avatar
                        sx={{
                          backgroundColor: 'primary.main',
                          height: 56,
                          width: 56
                        }}
                      >
                        <SvgIcon>
                          <HealthAndSafetyIcon />
                        </SvgIcon>
                      </Avatar>
                    </Stack>

                    <Button variant="contained" style={{ width: '100%' }} className='flex text-center mt-4' color='primary' onClick={navigate('/managePackages')}>
                      Manage Health Packages
                    </Button>
                  </CardContent>
                </Card>
              </Item>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </>
  );
};

export default AdminHomePage;
