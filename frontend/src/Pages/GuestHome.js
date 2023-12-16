
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { OverviewTotalCustomers } from '../overview/overview-total-doctors';
import { OverviewTotalProfit } from '../overview/overview-total-med';
import { OverviewLatestPatients } from '../overview/overview-latest-doctors';
import { Container, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { CardActions } from '@mui/material';
import { Paper } from '@mui/material';
import style from '../Styles/DoctorHome.css';
import { GuestNavBar } from '../components/guestNavBar';



const DoctorHome = () => {

  const navigate = useNavigate();
  const goToViewDoctorList = () => navigate('/viewDoctors');

  const viewAppointments = () => navigate('/viewAppointments');

  const healthPackages = () => navigate('/packageSubscribtion');

  const followUpDoc = () => navigate('/acceptRejectFollowUp');
  const prescription = () => navigate('/allPresDoc');

  return (
    <>
    <GuestNavBar/>
      <Carousel fade={true}>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText">View Doctors List</h2>
            <h4 className="captionText">View our  skilled doctors and their specialized fields.
      Book appointments effortlessly at competitive prices.</h4>
            {/* <Button className="navButton" style={{ minWidth: "150px" }} onClick={goToViewDoctorList}>View Doctors</Button> */}
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome2.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText">Pharmacy</h2>
            <h4 className="captionText">Fast, one-day delivery for your essential medicines! Browse our range of prescription and over-the-counter medications, all delivered straight to your doorstep.</h4>
            {/* <Button className="navButton" style={{ minWidth: "150px" }} onClick={viewAppointments}>View Appointments</Button> */}
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome3.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText"> Health Packages Offers</h2>
            <h4 className="captionText">Discover various health packages tailored to your needs from here.Get comprehensive health checkups and insights for a healthier life</h4>
            {/* <Button className="navButton" style={{ minWidth: "150px" }} onClick={healthPackages}>View Offers</Button> */}
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

      
      </Box>

    </>
  );
};

export default DoctorHome;
