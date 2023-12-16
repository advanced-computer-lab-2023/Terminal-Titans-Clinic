
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { OverviewTotalCustomers } from '../overview/overview-total-customers';
import { OverviewTotalProfit } from '../overview/overview-total-profit';
import { OverviewLatestPatients } from '../overview/overview-latest-patients';
import { Container, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { CardActions } from '@mui/material';
import { Paper } from '@mui/material';
import style from '../Styles/DoctorHome.css';


const DoctorHome = () => {

  const navigate = useNavigate();
  const goToViewPatientList = () => navigate('/viewMyPatientsList');

  const viewAppointments = () => navigate('/docViewAppointments');

  const addAvailableTimeSlots = () => navigate('/addAvailableSlots');

  const followUpDoc = () => navigate('/acceptRejectFollowUp');
  const prescription = () => navigate('/allPresDoc');

  return (
    <>
      <Carousel fade={true}>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText">View Patient List</h2>
            <h4 className="captionText">Click below to view your list of patients and their details.</h4>
            <Button className="navButton" style={{ minWidth: "150px" }} onClick={goToViewPatientList}>View Patients</Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome2.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText">View Appointments List</h2>
            <h4 className="captionText">Check your upcoming appointments and manage your schedule.</h4>
            <Button className="navButton" style={{ minWidth: "150px" }} onClick={viewAppointments}>View Appointments</Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome3.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText">Follow-up Requests</h2>
            <h4 className="captionText">Review and respond to follow-up requests from your patients.</h4>
            <Button className="navButton" style={{ minWidth: "150px" }} onClick={followUpDoc}>Handle Requests</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Box
        component="main"
        sx={{
          flexGrow: 1,

        }}
      >
        <Paper elevation={3} sx={{ py: 8 }}>
          <Container maxWidth="xl">
            <Grid container>
              <Grid xs={12} md={6} lg={4} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} md={10} sx={{ marginBottom: 1, marginRight: { xs: 1, sm: 2, md: 3 } }}>
                  <OverviewTotalCustomers sx={{ height: '100%' }} />
                </Grid>
                <Grid item xs={12} md={10} sx={{ marginBottom: 1, marginRight: { xs: 1, sm: 2, md: 3 } }}>
                  <OverviewTotalProfit sx={{ height: '100%' }} />
                </Grid>
              </Grid>

              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <OverviewLatestPatients
                  sx={{ height: '100%' }}
                />
              </Grid>
            </Grid>
          </Container>
        </Paper>

        <Paper elevation={3} sx={{ py: 8, marginTop: 3 }}>
          <Container>
            <Grid container rowGap={3}>

              <Grid xs={12} md={6} className='flex justify-content-center' sx={{minHeight: 350}}>
                <Card sx={{ maxWidth: 345 }} className='flex justify-content-between flex-column'>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={require('../Assets/appointment.jpeg')}
                    title="Appointment picture"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className='text-center'>
                      Add Available Time Slots
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className='text-center'>
                      Add your available time slots for future appointments.
                    </Typography>
                  </CardContent>
                  <CardActions className=''>
                    <Button size="small" className='w-100' onClick={addAvailableTimeSlots}>Add Available Time Slots</Button>
                  </CardActions>
                </Card>
              </Grid>

              <Grid xs={12} md={6} className='flex justify-content-center' sx={{minHeight: 350}}>
                <Card sx={{ maxWidth: 345 }} className='flex justify-content-between flex-column'>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={require('../Assets/prescription.jpeg')}
                    title="Prescription picture"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className='text-center'>
                      Perscriptions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className='text-center'>
                      Update a patient's prescription before it is submitted to the pharmacy.
                    </Typography>
                  </CardContent>
                  <CardActions className=''>
                    <Button size="small" className='w-100'onClick={prescription}>View Perscriptions</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Box>

    </>
  );
};

export default DoctorHome;
