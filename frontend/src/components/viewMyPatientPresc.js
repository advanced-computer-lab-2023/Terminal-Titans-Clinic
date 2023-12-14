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
import Table from 'react-bootstrap/Table';
import Stack from '@mui/material/Stack';
import { Popper } from '@mui/base/Popper';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { styled, css } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DownloadIcon from '@mui/icons-material/Download';


import { set } from "mongoose";
function ViewMyPatientPresc() {
    
  const [index, setIndex] = useState(0);
  const [prescriptions,setPrescriptions]=useState([]);
  const [currPresc,setCurPres]=useState({});
  const [startDate, setStartDate] = useState(dayjs(''));
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [Name,setName]=useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
const [allNames,setAllNames]=useState([]);
    const [curDoc, setCurDoc] = useState('');
    const[enable,setEnable]=useState(false);
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('Id');
    const getPres = async () => {
      setEnable(false);
      const response = await axios.post(
        `http://localhost:8000/doctor/getPrescriptionOfPatient/${userId}`,
        {  },
        { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
      );
      if (response.status === 200) {
        const data = response.data;
        console.log(data)
        setPrescriptions(data.final);
        if(data.final.length>0){
          setCurPres(data.final[0]);
          
        await axios.get(`http://localhost:8000/doctor/generatePdf/${data.final[0].id}`, {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
          }
        }).then(
          (res) => {
              const data = res.data;
              console.log(data.data.data)
              const src=`data:application/pdf;base64,${arrayBufferToBase64(data.data.data)}`
              setCurDoc(src)
              setEnable(true);
              
    
          }
        );
        }
      }
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
    const addPrescription = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/doctor/addPrescription/${userId}`, {}, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }
            });
            const data = response.data;
            
            console.log(data.result.result1);
           // setPrescId(data.result.result1);

            window.location.href = `/Health-Plus/addPresc?Id=${data.result.result1}`;
        } catch (error) {
            console.error('Error:', error);
        }
    }

   



  
useEffect(()=>{
  getPres();
 
    },[]
    )
   const showPres = async (item,index) => {
    setIndex(index)
    setEnable(false);
   
      setCurPres(prescriptions[index]);
      
        await axios.get(`http://localhost:8000/doctor/generatePdf/${prescriptions[index].id}`, {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
          }
        }).then(
          (res) => {
              const data = res.data;
              console.log(data.data.data)
              const src=`data:application/pdf;base64,${arrayBufferToBase64(data.data.data)}`
              setCurDoc(src)
              setEnable(true);
              
    
          }
        );
      
    }
    const handleChange = async (event, value) => {
      setEnable(false);
      setIndex(value-1)
      setCurPres(prescriptions[value-1]);
      await axios.get(`http://localhost:8000/doctor/generatePdf/${prescriptions[index].id}`, {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
          }
        }).then(
          (res) => {
              const data = res.data;
              console.log(data.data.data)
              const src=`data:application/pdf;base64,${arrayBufferToBase64(data.data.data)}`
              setCurDoc(src)
              setEnable(true);
              
    
          }
        );
      

    };
    return (
<div>

     
     

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
       <Button variant="dark" style={{ marginLeft: '10%' ,marginTop:'10%'}} onClick={addPrescription}>
      
      Add new Prescription
    </Button>
    
  
          <li key={`d`} style={{marginTop:"5%"}}>
            <ul>
              {prescriptions.map((item,index) => (
                <ListItemButton component="a" href="#simple-list">

                        <ListItemText primary={'Prescription ' + (parseInt(index) + 1)} onClick={() => { showPres(item,index) }} />
                       
                    </ListItemButton>
            
          
        ))}
        
        </ul>
        </li>
      </List>
      </div>
      <div style={{width: "80%"}}>
        <div style={{ }}>
          {prescriptions.length>0?
          <div>
      <Pagination style={{ display:'flex',  marginLeft: '300px' }} count={prescriptions.length} page={index+1} onChange={handleChange} />
      <Typography>Showing: Prescription {index+1}</Typography>

      <div id="login-form"  style={{ width: "600px " }}>
      
                <form>
               
                <div style={{ width: "100%", display: 'flex', justifyContent: 'flex-end' }}>
                  {enable?
                <Button variant="dark" style={{ marginRight:'5%' }} href={curDoc} download="Prescription.pdf">
                <DownloadIcon >
                
                </DownloadIcon>
                  </Button>:null}
               
                  <Button variant="dark" style={{ width: '45%' }} onClick={() => { }}>
                    Edit Prescription
                  </Button>
                </div>
                    <div className="form-group">
                       
                       <input type="text" id="name"  style={{width: "50%", border:"0px", padding:'8px'}} value='Doctor Name' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={currPresc.Name} readOnly />

                        <input type="text" id="Date"  style={{width: "50%", border:"0px", padding:'8px'}} value='Prescription Date' readOnly />
                        <input type="text" id="Date"  style={{width: "50%", border:"0px", padding:'8px'}} value={currPresc.Date?.substring(0,10)} readOnly />

                        <input type="text" id="Status"  style={{width: "50%", border:"0px", padding:'8px'}} value='Status' readOnly />
                        <input type="text" id="Status"  style={{width: "50%", border:"0px", padding:'8px'}} value={currPresc.status} readOnly />
                      
                        <Table striped bordered hover >
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th   >Dosage</th>
                </tr>
              </thead>
              <tbody>
                {currPresc.medicine.map((pres, index) => (
                  <tr>
                    <React.Fragment key={index}>
                      <td>{pres.Name}</td>
                      <td  >{pres.Dosage}</td>
                      
                       </React.Fragment>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* <p><a href={curDoc} download="your-filename.pdf">Download Health Doc</a></p>
                 <iframe src={curDoc} style={{width:'100%',height:'500px'}}></iframe> */}
                    </div>

                </form>
            </div>
            </div>:
            <h3>Loading or no prescriptions to show</h3>
                      }

      <div >
   </div>
      </div>
    
    </div>
    </div>
    </div>
    );
}

export default ViewMyPatientPresc;