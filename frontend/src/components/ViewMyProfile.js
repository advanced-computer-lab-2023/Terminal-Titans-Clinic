import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function ViewMyProfile() {
    const params = new URLSearchParams(window.location.search);
    const [myPatient, setMyPatient] = useState({});

const getMyPatient=async()=>{
    await axios.get('http://localhost:8000/patient/ViewMyProfile', {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
        }
      }).then(
        (res) => {
          const patInfoData = res.data
         setMyPatient(patInfoData.Result)
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
                    
                    <div className="form-group">
                       
                       <input type="text" id="name"  style={{width: "50%", border:"0px", padding:'8px'}} value='Name' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={myPatient.Name} readOnly />

                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px", padding:'8px'}} value='Date of birth' readOnly />
                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.DateOfBirth?.substring(0,10)} readOnly />

                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value='Email' readOnly />
                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.Email} readOnly />
                        <input type="text" id="Gender"  style={{width: "50%", border:"0px", padding:'8px'}} value='Gender' readOnly />
                        <input type="text" id="Gender"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.Gender} readOnly />
                        <input type="text" id="Mobile"  style={{width: "50%", border:"0px", padding:'8px'}} value='Mobile' readOnly />
                        <input type="text" id="Mobile"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.Mobile} readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value='Emergency Contact' readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.EmergencyName} readOnly />
                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px", padding:'8px'}} value='Emergency Mobile' readOnly />
                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.EmergencyMobile} readOnly />
                        <input type="text" id="EmergencyContactRelationToThePatient"  style={{width: "50%", border:"0px", padding:'8px'}} value='Emergency Contact Relation' readOnly />
                        <input type="text" id="EmergencyContactRelationToThePatient"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.EmergencyContactRelationToThePatient} readOnly />
                        <input type="text" id="Wallet"  style={{width: "50%", border:"0px", padding:'8px'}} value='Wallet' readOnly />
                        <input type="text" id="Wallet"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.Wallet} readOnly />
                        

                                 
                    </div>
                </form>
            </div>
        </div>
    );
}
export default ViewMyProfile;