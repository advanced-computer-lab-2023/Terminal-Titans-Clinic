// import React from "react";
import "../Styles/LoginForm.css";
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewDocProfile() {
const [edit,setEdit]=useState(false);
    const [myInfo, setMyInfo] = useState({});
    const [email, setEmail] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');

const getMyInfo=async()=>{
    await axios.get(`http://localhost:8000/doctor/getCurrentDoctor`, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
        }
      }).then(
        (res) => {
          const InfoData = res.data
          console.log(InfoData)
         setMyInfo(InfoData.Result)
         setEmail(InfoData.Result.Email)
            setAffiliation(InfoData.Result.Affiliation)
            setHourlyRate(InfoData.Result.HourlyRate)
         
  
        }
      );
}
useEffect(()=>{
    getMyInfo();
    console.log(edit)
    },[]
    )
    const update=async()=>{

        await axios.put(`http://localhost:8000/doctor/updateDoctor`,{
            Email:email,
            Affiliation:affiliation,
            HourlyRate:hourlyRate
            
        },
        {
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
            }
          }).then(
            (res) => {
              const InfoData = res.data
              console.log(InfoData)
              setEdit(false)
              getMyInfo();
             
  
            }
          );
    }

   
    return (
        <div>
            <div id="login-form"  style={{ width: "600px " }}>
                <form style={{paddingTop:'0px', marginTop:'-30px'}}>
                    
                    <div className="form-group">
                       {!edit? 
            <div style={{paddingTop:'15px'}}>
                        <input  type="text" id="name"  style={{width: "50%", border:"0px", padding:'8px'}} value='Name'  />
                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Name} disabled />

                        <input type="text" id="Username"  style={{width: "50%", border:"0px",padding:'8px'}} value='Username' readOnly />
                        <input type="text" id="Username"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Username} disabled />
                       

                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px",padding:'8px'}} value='Date of birth' readOnly />
                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.DateOfBirth?.substring(0,10)} disabled />

                        <input type="text" id="Email"  style={{width: "50%", border:"0px",padding:'8px'}} value='Email' readOnly />
                        <input type="text" id="Email"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Email} disabled />

                        <input type="text" id="Affiliation"  style={{width: "50%", border:"0px",padding:'8px'}} value='Affiliation' readOnly />
                        <input type="text" id="Affiliation"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Affiliation} disabled />

                        <input type="text" id="Education"  style={{width: "50%", border:"0px",padding:'8px'}} value='Education' readOnly />
                        <input type="text" id="Education"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Education} disabled />

                        <input type="text" id="hourlyRate"  style={{width: "50%", border:"0px",padding:'8px'}} value='Hourly Rate' readOnly />
                        <input type="text" id="hourlyRate"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.HourlyRate} disabled />

                        <input type="text" id="Speciality"  style={{width: "50%", border:"0px",padding:'8px'}} value='Speciality' readOnly />
                        <input type="text" id="Speciality"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Speciality} disabled />

                        <Button
              fullWidth
              variant="contained"
              onClick={() => setEdit(true)}
            >
             Edit
            </Button>
            </div>
            :
            <div style={{paddingTop:'15px'}}>
            <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value='Name' readOnly />
            <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Name} disabled />

             <input type="text" id="Username"  style={{width: "50%", border:"0px",padding:'8px'}} value='Username' readOnly />
             <input type="text" id="outlined-disabled" style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Username} disabled />
            

             <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px",padding:'8px'}} value='Date of birth' readOnly />
             <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.DateOfBirth} disabled />

             <input type="text" id="Email"  style={{width: "50%", border:"0px",padding:'8px'}} value='Email' readOnly />
             <input type="text" id="Email"  style={{width: "50%",padding:'8px'}} value={email} 
              onChange={(e) => setEmail(e.target.value)}/>

             <input type="text" id="Affiliation"  style={{width: "50%", border:"0px",padding:'8px'}} value='Affiliation' readOnly />
             <input type="text" id="Affiliation"  style={{width: "50%",padding:'8px'}} value={affiliation} 
                           onChange={(e) => setAffiliation(e.target.value)}/>


             <input type="text" id="Education"  style={{width: "50%", border:"0px",padding:'8px'}} value='Education' readOnly />
             <input type="text" id="Education"  style={{width: "50%",padding:'8px'}} value={myInfo.Education}  disabled/>

             <input type="text" id="HourlyRate"  style={{width: "50%", border:"0px",padding:'8px'}} value='Hourly Rate' readOnly />
             <input type="text" id="HourlyRate"  style={{width: "50%",padding:'8px'}} value={hourlyRate} 
                           onChange={(e) => setHourlyRate(e.target.value)}/>
             <input type="text" id="Speciality"  style={{width: "50%", border:"0px",padding:'8px'}} value='Speciality' readOnly />
             <input type="text" id="Speciality"  style={{width: "50%", border:"0px",padding:'8px'}} value={myInfo.Speciality} disabled />

             <Button fullWidth  variant="contained"  onClick={() => update()}> Save changes</Button>
             </div>
                       }
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ViewDocProfile;