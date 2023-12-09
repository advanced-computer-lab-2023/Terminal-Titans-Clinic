import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';


// ----------------------------------------------------------------------

   
const DoctorsList = () => {
  console.log("here15**************************************");
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [Name, setName] = useState("");
  const [Speciality, setSpeciality] = useState("");
  //const [checked, setChecked] = useState(false);

  const getDoctors = async () => {
    try{
    console.log("hanA********************************");
    const response = await axios.post(
      `http://localhost:8000/patient/getDoctors`,
      { Name, Speciality },
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );
    console.log("ouuutttt");
    if (response.status === 200) {
      console.log("no errrrooorrrrr");
      const doctors = response.data.Result;
      console.log("doc"+doctors);
      setDoctors(doctors);
    }else{
      console.log("errrrooorrrrr");
    }}
    catch(error){
console.log(error);
    }
  }
  const handleSearch = () => {
    // Handle the search logic here
    getDoctors();
  };

 

  useEffect(() => {
    // Fetch initial data
    getDoctors();
  }, []);

  return (
    <div>
      <h1>Doctors List</h1>
      <TextField
        id="docName"
        label="Doctor's Name"
        variant="outlined"
        size="small"
        sx={{ paddingRight: 1 }}
        value={Name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        id="docspeciality"
        label="Doctor's Speciality"
        variant="outlined"
        size="small"
        sx={{ paddingRight: 1 }}
        value={Speciality}
        onChange={(e) => setSpeciality(e.target.value)}
      />

      <Button variant="dark" onClick={handleSearch} size="sm">
        Search
      </Button>

   
      <br></br>
      <br></br>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Speciality</th>
          
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, index) => (
            <tr key={index}>
              {/* Render doctor details here */}
              <td>{doctor.Name}</td>
              <td>{doctor.Speciality}</td>
              <td>
                <Button
                  variant="dark"
                  style={{ width: '45%' }}
                  onClick={() => navigate(`/Health-Plus/viewMyPatientInfo?Id=${doctor.id}`)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorsList;