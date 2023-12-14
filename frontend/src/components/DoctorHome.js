
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { OverviewTotalCustomers } from '../overview/overview-total-customers';
import { OverviewTotalProfit } from '../overview/overview-total-profit';
import { OverviewLatestPatients } from '../overview/overview-latest-patients';
import { Container, Grid, Box } from '@mui/material';
import style from '../Styles/DoctorHome.css';


const DoctorHome = () => {

  return (
    <>
      <Carousel fade={true}>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText">View Patient List</h2>
            <h4 className="captionText">Click below to view your list of patients and their details.</h4>
            <Button className="navButton" style={{ minWidth: "150px" }}>View Patients</Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome2.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText">View Appointments List</h2>
            <h4 className="captionText">Check your upcoming appointments and manage your schedule.</h4>
            <Button className="navButton" style={{ minWidth: "150px" }}>View Appointments</Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className='blackScreen'></div>
          <img src={require('../Assets/doctorHome3.png')} alt="First slide" className="myImg" />
          <Carousel.Caption>
            <h2 className="captionText">Follow-up Requests</h2>
            <h4 className="captionText">Review and respond to follow-up requests from your patients.</h4>
            <Button className="navButton" style={{ minWidth: "150px" }}>Handle Requests</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
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
      </Box>
    </>
  );
};

export default DoctorHome;
