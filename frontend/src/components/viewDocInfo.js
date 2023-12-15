// import React from "react";
import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useHistory, useNavigate } from 'react-router-dom';

function ViewDocInfo() {


<h1>anaa</h1>
    
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('Id');
    const [doctor, setDoctor] = useState({});

const getDocInfo=async()=>{
    
    try {
        const response = await axios.get(`http://localhost:8000/patient/selectDoctors/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem("token")
          }
        });
        console.log(response);
  
        const selectedDoc = response.data.Result[0];
        console.log(selectedDoc);
        setDoctor(selectedDoc);
        console.log("Selected Doctor:", selectedDoc);
      } catch (error) {
        console.error("Error fetching doctor info:", error);
      }
    }
    //console.log(response.data);
  
    useEffect(() => {
      getDocInfo();
    }, []);
  
    console.log(doctor.Name);
    console.log(doctor.id);
   
    return (
        <div>
            <div id="login-form"  style={{ width: "600px " }}>
                <form>
                    
                    <div className="form-group">
                       
                       <input type="text" id="namel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Name' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={doctor.Name} readOnly />

                        <input type="text" id="DateOfBirthl"  style={{width: "50%", border:"0px", padding:'8px'}} value='Date of birth' readOnly />
                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.DateOfBirth?.substring(0,10)} readOnly />

                        <input type="text" id="Emaill"  style={{width: "50%", border:"0px", padding:'8px'}} value='Email' readOnly />
                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Email} readOnly />

                        <input type="text" id="Affiliationl"  style={{width: "50%", border:"0px", padding:'8px'}} value='Affiliation' readOnly />
                        <input type="text" id="Affiliation"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Affiliation} readOnly />

                        <input type="text" id="Mobilel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Hourly Rate Price' readOnly />
                        <input type="text" id="Mobile"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.HourlyRate} readOnly />

                        <input type="text" id="EmergencyNamel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Education' readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Education} readOnly />

                        <input type="text" id="Specialityl"  style={{width: "50%", border:"0px", padding:'8px'}} value='Speciality' readOnly />
                        <input type="text" id="Speciality"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Speciality} readOnly />

                        <input type="text" id="sessionPricel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Session Price' readOnly />
                        <input type="text" id="sessionPrice"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.sessionPrice} readOnly />
                 
                 
                 
                    </div>

                </form>
                <Button
                  variant="dark"
                  style={{ width: '45%' }}
                  //onClick={() => navigate(`/showAvailableSlots?Id=${doctor.id}`)}
                 // onClick={() => navigate(`/reschedule`)}
                
                 onClick={() =>window.location.href=`/Health-Plus/showAvailableSlots?Id=${doctor.id}`}
                >
                  Book Appointment
                </Button>
            </div>
        </div>
    );
}

export default ViewDocInfo;