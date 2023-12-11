// import React from "react";
import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewDocInfo() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('Id');
    const [doctor, setdoctor] = useState({});

const getDocInfo=async()=>{
    await axios.get(`http://localhost:8000/patient/selectDoctors/${userId}`, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
        }
      }).then(
        (res) => {
          const selectedDoc = res.data.Result
          console.log(selectedDoc)
         setdoctor(selectedDoc)
         
  
        }
      );

}
console.log(doctor.Name);
useEffect(()=>{
    getDocInfo();
    },[]
    )
   
    return (
        <div>
            <div id="login-form"  style={{ width: "600px " }}>
                <form>
                    
                    <div className="form-group">
                       
                       <input type="text" id="name"  style={{width: "50%", border:"0px", padding:'8px'}} value='Name' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={doctor.Name} readOnly />

                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px", padding:'8px'}} value='Date of birth' readOnly />
                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.DateOfBirth?.substring(0,10)} readOnly />

                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value='Email' readOnly />
                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Email} readOnly />

                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value='Affiliation' readOnly />
                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Affiliation} readOnly />

                        <input type="text" id="Mobile"  style={{width: "50%", border:"0px", padding:'8px'}} value='Hourly Rate Price' readOnly />
                        <input type="text" id="Mobile"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.HourlyRate} readOnly />

                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value='Education' readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Education} readOnly />

                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px", padding:'8px'}} value='Speciality' readOnly />
                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Speciality} readOnly />

                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px", padding:'8px'}} value='Session Price' readOnly />
                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.sessionPrice} readOnly />
                 
                 
                 
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ViewDocInfo;