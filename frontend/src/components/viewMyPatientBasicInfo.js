// import React from "react";
import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profileImage from "../Assets/profile.png";
function ViewMyPatientBasicInfo() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('Id');
    const [myPatient, setMyPatient] = useState({});

const getMyPatient=async()=>{
    await axios.get(`http://localhost:8000/doctor/getPatientInfoAndHealth/${userId}`, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
        }
      }).then(
        (res) => {
          const patInfoData = res.data
          console.log(patInfoData)
         setMyPatient(patInfoData.Result.patient)
         
  
        }
      );
}
useEffect(()=>{
        getMyPatient();
    },[]
    )
   
    return (
        <div>
            <div id="login-form"  style={{ width: "600px " }}>
                <form>
                    <div style={{ textAlign: "center" , paddingLeft:'150px'}}>
                        <img src={profileImage} width='200'   alt="Image description" />
                    </div>
                    <div className="form-group">
                       
                       <input type="text" id="name"  style={{width: "50%", border:"0px"}} value='Name' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px"}} value={myPatient.Name} readOnly />

                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px"}} value='Date of birth' readOnly />
                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px"}} value={myPatient.DateOfBirth?.substring(0,10)} readOnly />

                        <input type="text" id="Email"  style={{width: "50%", border:"0px"}} value='Email' readOnly />
                        <input type="text" id="Email"  style={{width: "50%", border:"0px"}} value={myPatient.Email} readOnly />
                        <input type="text" id="Gender"  style={{width: "50%", border:"0px"}} value='Gender' readOnly />
                        <input type="text" id="Gender"  style={{width: "50%", border:"0px"}} value={myPatient.Gender} readOnly />
                        <input type="text" id="Mobile"  style={{width: "50%", border:"0px"}} value='Mobile' readOnly />
                        <input type="text" id="Mobile"  style={{width: "50%", border:"0px"}} value={myPatient.Mobile} readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px"}} value='Emergency Contact' readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px"}} value={myPatient.EmergencyName} readOnly />
                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px"}} value='Emergency Mobile' readOnly />
                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px"}} value={myPatient.EmergencyMobile} readOnly />
                        <input type="text" id="EmergencyContactRelationToThePatient"  style={{width: "50%", border:"0px"}} value='Relation' readOnly />
                        <input type="text" id="EmergencyContactRelationToThePatient"  style={{width: "50%", border:"0px"}} value={myPatient.EmergencyContactRelationToThePatient} readOnly />
                 
                 
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ViewMyPatientBasicInfo;