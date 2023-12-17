import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Divider,Card, CardHeader, IconButton, Paper, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import Nav from "../components/Admin-NavBar.js";
import { Scrollbar } from '../overview/scrollbar';
import DoctorApplicationCard from './DoctorApplicationCard'; // Import your DoctorApplicationCard component
import '../Styles/Admin.css';
import { Container, Grid } from '@mui/material';



const ViewDocApplications = () => {
  const [doctors, setDoctors] = useState([]);

  const acceptDoctor = async (username) => {
    await axios(
        {
            method: 'post',
            url: `http://localhost:8000/admin/DoctorAcceptance/${username}`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        }
    ).then((response) => {
        console.log(response);
        setDoctors(response.data.Result);
    }).catch((error) => {
        console.log(error);
    });
}

const rejectDoctor = async (username) => {
    console.log(username);
    await axios(
        {
            method: 'delete',
            url: `http://localhost:8000/admin/DoctorRejection/${username}`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        }
    ).then((response) => {
        console.log(response);
        setDoctors(response.data.Result);
    }).catch((error) => {
        console.log(error);
    });
}

const getDoctors = async () => {
    debugger
    await axios(
        {
            method: 'get',
            url: 'http://localhost:8000/admin/fetchReqDoctors',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        }
    ).then((response) => {
        console.log(response);
        setDoctors(response.data.users);
    }).catch((error) => {
        console.log(error);
    });
}


  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <div>
      <Nav />
      <div style={{ width: '100%', padding: '10px' }}>
        <h1 style={{ color: 'white', textAlign: 'center', backgroundColor: 'black', borderRadius: '15px' }}>Manage Requested Doctors</h1>
      </div>
          
      <Box
        component="main"
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Paper elevation={0} sx={{}}>
        <Container>
            <Grid container>

            <Grid item  >
  <Card style={{ width: '100%', height: '100%' }}>
        <CardHeader title="Doctor Applications Table" />
        <Divider />

          <Scrollbar sx={{ flexGrow: 1 }}>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Hourly Rate</TableCell>
                    <TableCell>Affiliation</TableCell>
                    <TableCell>Education</TableCell>
                    <TableCell>Speciality</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors.map((doctor, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{doctor.Name}</TableCell>
                      <TableCell>{doctor.Email}</TableCell>
                      <TableCell>{doctor.DateOfBirth?.substring(0,10)}</TableCell>
                      <TableCell>{doctor.HourlyRate}</TableCell>
                      <TableCell>{doctor.Affiliation}</TableCell>
                      <TableCell>{doctor.Education}</TableCell>
                      <TableCell>{doctor.Speciality}</TableCell>
                      <TableCell>
                        <IconButton
                          endIcon={(
                            <SvgIcon fontSize="small">
                              <ArrowRightIcon />
                            </SvgIcon>
                          )}
                          onClick={() => window.location.href = `/Health-Plus/viewRegDocDoc?Id=${doctor._id}`}
                          style={{ backgroundColor: 'black', width:'98%', margin:'2%',fontSize: 'medium', color: 'white', borderRadius: '5px', padding: '6px' }}
                        >
                          View Doc
                        </IconButton>
                        <IconButton style={{ backgroundColor: '#198754', width:'48%',margin:'1%', fontSize: 'medium', color: 'white', borderRadius: '5px', padding: '6px' }}variant="success"  onClick={() => acceptDoctor(doctor.Username)}>
                          Accept
                        </IconButton>
                        <IconButton style={{ backgroundColor: '#dc3545', width:'48%',margin:'1%', fontSize: 'medium', color: 'white', borderRadius: '5px', padding: '6px' }}variant="success"  onClick={() => rejectDoctor(doctor.Username)}>
                          Reject
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
          </Card>
                  
                  
                
                  </Grid>
                        </Grid> 
                      </Container>
        </Paper>
      </Box>
    </div>
  );
};

export default ViewDocApplications;
