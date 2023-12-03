// import React from "react";
import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton';
import Button from 'react-bootstrap/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { set } from "mongoose";
function ViewMyPatientHealthRecords() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('Id');
    const [myPatient, setMyPatient] = useState({});
    const [userHealthRecords, setUserHealthRecords] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [upload,setUpload]=useState(false)
  const [index, setIndex] = useState(0);
    
    const [curDoc, setCurDoc] = useState('');
const getMyPatient=async()=>{
    await axios.get(`http://localhost:8000/doctor/getPatientInfoAndHealth3/${userId}`, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
        }
      }).then(
        (res) => {
            const data = res.data;
            
            setUserHealthRecords(data.Result.healthDoc)
            console.log(data.Result.healthDoc)
            if(data.Result.healthDoc.length>0){
                const src=`data:application/pdf;base64,${arrayBufferToBase64(data.Result.healthDoc[0].data)}`
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
  const handleFileChange = (e) => {
    // Handle file selection
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const handleSubmit = async () => {
    // handleAddClick();
     const formData = new FormData();
     // const pat=aptmnts.PatientId;
 
       formData.append('file', selectedFile);
    
     const response = await axios.post(
       `http://localhost:8000/doctor/addrecord/${userId}`,
       formData,
       { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
   ).then(() => {
    setUpload('true');

  }).catch((err) => alert(err.message));
     // if (response.status === 200) {
       // console.log(response.data);
     // }
   }
  
useEffect(()=>{
        getMyPatient();
        setUpload(false)
        setSelectedFile(null)
    },[upload]
    )
   const showDoc = (item,index) => {
    setIndex(index)
    console.log(item)
      const src=`data:application/pdf;base64,${arrayBufferToBase64(item.data)}`
    setCurDoc(src)
    }
    const handleChange = (event, value) => {
      setIndex(index)

      showDoc(userHealthRecords[value-1],value-1)

    };
    return (
<div>
<Form.Label>Upload Health Record</Form.Label>
<Form.Group controlId="formFile" className="mb-3"style={{display:"flex"}}>
        
        <Form.Control type="file" style={{width:"80%" ,height:"10%"}}onChange={handleFileChange} />
        <Button variant="outline-dark" onClick={handleSubmit} style={{padding: "0px 20px;"}}> 
        Upload < FileUploadIcon />
      </Button>
      
      </Form.Group>
     
     

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
       
          <li key={`d`} style={{marginTop:"5%"}}>
            <ul>
              {userHealthRecords.map((item,index) => (
                <ListItemButton component="a" href="#simple-list">

                        <ListItemText primary={'Document ' + (parseInt(index) + 1)} onClick={() => { showDoc(item,index) }} />
                       
                    </ListItemButton>
            
          
        ))}
        
        </ul>
        </li>
      </List>
      </div>
      <div style={{width: "80%"}}>
        <div style={{ }}>
      <Pagination style={{ display:'flex',  marginLeft: '300px' }} count={userHealthRecords.length} page={index+1} onChange={handleChange} />
      <Typography>Showing: Document {index+1}</Typography>

      <div >
      <iframe src={curDoc}  width="800" height="600"></iframe>
   </div>
      </div>
    
    </div>
    </div>
    </div>
    );
}

export default ViewMyPatientHealthRecords;