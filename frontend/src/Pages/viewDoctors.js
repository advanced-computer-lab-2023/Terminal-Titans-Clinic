import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';


// ----------------------------------------------------------------------

   
const   DoctorsList = () => { 
    const navigate=useNavigate();

    const [doctors,setDoctors] = useState([]);
    const [filterButtonEl, setFilterButtonEl] = React.useState(null);
    const [name, setName] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [checked, setChecked] = React.useState(false);


const getDoctors = async () => {
    const response = await axios.get(
      `http://localhost:8000/patient/getDoctors`,
      
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );
    if (response.status === 200) {
      const doctor = response.data.Result;
      console.log(doctor);
      setDoctors(doctor);
    }
  }

   /* const response = await axios.get(
      `http://localhost:8000/doctor/getPatientName/${name}`,
      {
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") },
        
      }
    );
    if (response.status === 200) {
      const patient = response.data.Result;
      console.log(patient);
      setPatients(patient);
    } */
  } 
   
  const handleChange = (event) => {
    setChecked(event.target.checked);
    
  }
  useEffect(() => {
    getDoctors();
  }, []);

    return (
        <div>
    <h1>Doctors List</h1>
    <TextField id="docName" label="Doctor's Name" variant="outlined" size="small" sx={{ paddingRight: 1 }}
    value={name}
    onChange={(e) => setName(e.target.value)}/>

<h1>Doctors List</h1>
    <TextField id="docspeciality" label="Doctor's Speciality" variant="outlined" size="small" sx={{ paddingRight: 1 }}
    value={speciality}
    onChange={(e) => setName(e.target.value)}/>
   
    <Button variant="dark"  onClick={(event) => { getDoctors() }} size="sm">Search</Button>
    
    <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleChange} />} 
        label="Upcoming"
        sx={{ marginLeft: 100 }}
    />
<br></br>
<br></br>
        <Table striped bordered hover>
            <thead>
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
                {patients.map((patient, index) => (
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
                    </tr>
                ))}
            </tbody>
        </Table >
        </div>
    );
}

export default DoctorsList;