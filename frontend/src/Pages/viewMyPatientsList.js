import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import {DoctorNavBar} from '../components/doctorNavBar';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';


// ----------------------------------------------------------------------

   
const   PatientList = () => { 
    const navigate=useNavigate();

    const [patients,setPatients] = useState([]);
    const [filterButtonEl, setFilterButtonEl] = React.useState(null);
    const [name, setName] = useState("");
    const [checked, setChecked] = React.useState(false);


const getPatients = async () => {
    const response = await axios.get(
      `http://localhost:8000/doctor/getPatientsList2`,
      
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );
    if (response.status === 200) {
      const patient = response.data.Result;
      console.log(patient);
      setPatients(patient);
    }
  }
const getPatientName= async () => {
    if(name===""){
        return getPatients();
    }
    const response = await axios.get(
      `http://localhost:8000/doctor/getPatientName/${name}`,
      {
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") },
        
      }
    );
    if (response.status === 200) {
      const patient = response.data.Result;
      console.log(patient);
      setPatients(patient);
    }
  } 
   
  const handleChange = (event) => {
    setChecked(event.target.checked);
    
  }
  useEffect(() => {
    getPatients();
  }, []);

    return (
        <div>
            <DoctorNavBar/>
            {/* <div   style={{ width: "100% ",backgroundColor:'black' }}>
           
           <h1 style={{color:'white', textAlign:'center'}}>Patients List </h1>
           </div> */}
    {/* <TextField id="patName" label="Patient's Name" variant="outlined" size="small" sx={{ paddingRight: 1 }}
    value={name}
    onChange={(e) => setName(e.target.value)}/>
   
    <Button variant="dark"  onClick={(event) => { getPatientName() }} size="sm">Search</Button> */}
    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', height:'50px', marginTop:'10px'}}>
    <InputGroup className="mb-1" >
        
        <Form.Control
          id="searchInput"
          type="search"
          placeholder="Search by Name"
          aria-label="Text input for search"
          value={name}
          size="small"
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          variant="outline-secondary"
          title="Search"
          id="segmented-button-dropdown-1"
          size="small"
          onClick={(event) => { getPatientName() }} 
        >
          Search
         
        </Button>
       </InputGroup>
    <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleChange} />} 
        label="Upcoming"
        sx={{ marginLeft: 100 }}
    />
    </div>
<br></br>
<br></br>
        <Table striped bordered hover>
            <thead>
            <tr>
                  
                  <th colSpan={6} style={{ fontSize: '24px' }}>Patients List</th>
                 

            </tr>
                <tr>
                   
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Date of Birth</th>
                    <th>more info</th>
                    
                </tr>
            </thead>
            <tbody>
                {patients.map((patient, index) => 
                (  (checked===false || (checked && patient.upcoming)) ?
                    <tr>
                        <React.Fragment key={index}>
                          
                            <td>{patient.Name}</td>
                            <td>{patient.Gender}</td>
                            <td>{patient.Mobile}</td>
                            <td>{patient.Email}</td>
                            <td>{patient.DateOfBirth?.substring(0,10)}</td>
                            <td>
                            <Button variant="dark" style={{ width: '45%' }} onClick={() => window.location.href=`/Health-Plus/viewMyPatientInfo?Id=${patient.id}`} >
                                View
                              </Button>
                              </td>
                              </React.Fragment>
                    </tr> : null
                ))}
            </tbody>
        </Table >
        </div>
    );
}

export default PatientList;