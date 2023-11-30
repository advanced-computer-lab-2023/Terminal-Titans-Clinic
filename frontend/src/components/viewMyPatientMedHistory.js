// import React from "react";
import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton';
import { set } from "mongoose";
function ViewMyPatientMedHistory() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('Id');
    const [myPatient, setMyPatient] = useState({});
    const [userHealthHistoryPDF, setUserHealthHistoryPDF] = useState([]);
    const [userHealthHistoryIMG, setUserHealthHistoryIMG] = useState([]);
    const [curDoc, setCurDoc] = useState('');
const getMyPatient=async()=>{
    await axios.get(`http://localhost:8000/doctor/getPatientInfoAndHealth2/${userId}`, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
        }
      }).then(
        (res) => {
            const data = res.data;
            
          setUserHealthHistoryPDF(data.Result.medicalHistoryPDF)
            setUserHealthHistoryIMG(data.Result.medicalHistoryImage)
            if(data.Result.medicalHistoryPDF.length>0){
                const src=`data:${data.Result.medicalHistoryPDF[0].contentType};base64,${arrayBufferToBase64(data.Result.medicalHistoryPDF[0].data.data)}`
                setCurDoc(src)
            }
            else if(data.Result.medicalHistoryImage.length>0){
                const src=`data:${data.Result.medicalHistoryImage[0].contentType};base64,${arrayBufferToBase64(data.Result.medicalHistoryImage[0].data.data)}`
                setCurDoc(src)
            }
         
  
        }
      );
}
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
  
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  
    return btoa(binary);
  }
useEffect(()=>{
        getMyPatient();
    },[]
    )
   const showDoc = (item) => {
    console.log(item)
      const src=`data:${item.contentType};base64,${arrayBufferToBase64(item.data.data)}`
    setCurDoc(src)
    }
    return (

<div style={{ display: "flex"}}>
      <div style={{width:" 20%"}}>
      <List
        sx={{
          width: '100%',
          maxWidth: 300,
          position: 'relative',
          overflow: 'auto',
          maxHeight: 300,
          '& ul': { padding: 0 },
        }}
        subheader={<li />}
      >
       
          <li key={`d`}>
            <ul>
              {userHealthHistoryPDF.map((item,index) => (
                <ListItemButton component="a" href="#simple-list">

                        <ListItemText primary={'Document ' + (parseInt(index) + 1)} onClick={() => { showDoc(item) }} />
                       
                    </ListItemButton>
            
          
        ))}
         {userHealthHistoryIMG.map((item,index) => (
                <ListItemButton component="a" href="#simple-list">

                        <ListItemText primary={'Document ' + (parseInt(index) +userHealthHistoryPDF.length+1 )} onClick={() => { showDoc(item) }} />
                       
                    </ListItemButton>
            
          
        ))}
        </ul>
        </li>
      </List>
      </div>
      <div style={{width: "80%"}}>
     
      <div >
      <iframe src={curDoc}  width="800" height="600"></iframe>
   
      </div>
    </div>
    </div>
    );
}

export default ViewMyPatientMedHistory;