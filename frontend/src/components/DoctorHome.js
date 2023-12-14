
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { OverviewTotalCustomers } from '../overview/overview-total-customers';
import { OverviewTotalProfit } from '../overview/overview-total-profit';
import { Container, Grid, Box } from '@mui/material';
import style from '../Styles/DoctorHome.css';


const DoctorHome = () => {
  const [wltAmnt, setWltAmnt] = useState([]);
  // const [familyHealthPackageData, setFamilyHealthPackageData] = useState([]);
  const navigate = useNavigate();

  const fetchwltAmnt = async () => {
    try {
      const response = await axios.get("http://localhost:8000/doctor/getWalletAmount", {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      });

      const result = response.data.Amount;
      console.log(result);
      setWltAmnt(result);


    } catch (error) {
      console.error('Error fetching wallet data:', error.message);
    }
  };

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
          <Grid container spacing={3}>
            <Grid xs={12} md={6} lg={3}>
              <OverviewTotalCustomers sx={{ height: '100%' }} value="$15k" />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit sx={{ height: '100%' }} value="$15k" />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DoctorHome;
