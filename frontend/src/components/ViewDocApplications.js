// import React from "react";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "../Styles/LoginForm.css";
import DoctorCard from './DoctorApplicationCard';
import Nav from "../components/Admin-NavBar.js";


function ViewDocApplications() {
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
        <Nav/>
        <div>
          <div style={{ width: "100%", padding: '10px' }}>
            <h1 style={{ color: 'white', textAlign: 'center',backgroundColor: 'black',borderRadius:'15px' }}>Requested Doctors List </h1>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={index}
                doctor={doctor}
                onAccept={acceptDoctor}
                onReject={rejectDoctor}
              />
            ))}
          </div>
        </div>
        </div>
      );

   
    
}




export default ViewDocApplications;


// ----------------------------------------------------------------------



