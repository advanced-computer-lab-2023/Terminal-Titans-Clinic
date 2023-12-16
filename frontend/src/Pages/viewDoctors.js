import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FilterListIcon from '@mui/icons-material/FilterList';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Popper } from '@mui/base/Popper';
import { styled, css } from '@mui/system';
import Modal from 'react-bootstrap/Modal';
import {PatientNavBar} from '../components/PatientNavBar.jsx';



// ----------------------------------------------------------------------

   
const DoctorsList = () => {
  console.log("here15**************************************");
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [Name, setName] = useState("");
  const [Speciality, setSpeciality] = useState("");
  const [date, setDate] = useState("");
  const [specialityFilter, setSpecialityFilter] = React.useState('');
  //const [checked, setChecked] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [curInd, setCurInd] = React.useState(0);
  const [modalShow, setModalShow] = React.useState(false);



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

  function MyVerticallyCenteredModal(props) {
    
   
    
   
   
    return (
    
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          Doctor Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
                    
                    <div className="form-group">
                       
                       <input type="text" id="namel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Name' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={doctors[curInd]?.Name} readOnly />

                    
                        <input type="text" id="Emaill"  style={{width: "50%", border:"0px", padding:'8px'}} value='Email' readOnly />
                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctors[curInd]?.Email} readOnly />

                        <input type="text" id="Affiliationl"  style={{width: "50%", border:"0px", padding:'8px'}} value='Affiliation' readOnly />
                        <input type="text" id="Affiliation"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctors[curInd]?.Affiliation} readOnly />

  
                        <input type="text" id="EmergencyNamel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Education' readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctors[curInd]?.Education} readOnly />

                        <input type="text" id="Specialityl"  style={{width: "50%", border:"0px", padding:'8px'}} value='Speciality' readOnly />
                        <input type="text" id="Speciality"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctors[curInd]?.Speciality} readOnly />

                        <input type="text" id="sessionPricel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Session Price' readOnly />
                        <input type="text" id="sessionPrice"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctors[curInd]?.sessionPrice} readOnly />
                 
                 
                 
                    </div>
                    <Button
                  variant="dark"
                  style={{ width: '100%' }}
                  //onClick={() => navigate(`/showAvailableSlots?Id=${doctor.id}`)}
                 // onClick={() => navigate(`/reschedule`)}
                
                 onClick={() =>window.location.href=`/Health-Plus/showAvailableSlots?Id=${doctors[curInd]?.id}`}
                >
                  Book Appointment
                </Button>
                </form>
        </Modal.Body>
      </Modal>
    

  );
    }
  const filterDoctors = async () => {
    console.log(specialityFilter)
    console.log(date)
    const response = await axios.post(
      `http://localhost:8000/patient/filterDoctors`,
      { Speciality : specialityFilter, date },
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );

    if (response.status === 200) {
      const doctors = response.data.Result;
      setDoctors(doctors);
    }else{
      console.log("errrrooorrrrr");
    }
  }
  const StyledPopperDiv = styled('div')(
    ({ theme }) => css`
      background-color: ${theme.palette.mode === 'dark' ? '#1C2025' : '#fff'};
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? '#434D5B' :'#DAE2ED'};
      box-shadow: ${theme.palette.mode === 'dark'
        ? `0px 4px 8px rgb(0 0 0 / 0.7)`
        : `0px 4px 8px rgb(0 0 0 / 0.1)`};
      padding: 0.75rem;
      color: ${theme.palette.mode === 'dark' ? '#E5EAF2' : '#434D5B'};
      font-size: 0.875rem;
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 500;
      opacity: 1;
      margin: 0.25rem 0;
    `,
  );
  const handleSearch = () => {
    // Handle the search logic here
    setSpecialityFilter('');
    setDate('');
    getDoctors();
  };

  const handleFilter = () => {
    // Handle the search logic here
    setSpeciality('');
    setName('');
    filterDoctors();
  };

  const resetFilter = async (event) => {
    setSpecialityFilter('');
    setDate('');
    handleClick(event);
    const databody={"Name":"","Speciality":""}
    const response = await axios.post(
      `http://localhost:8000/patient/getDoctors`,
      {"Name":"","Speciality":""},
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );

    if (response.status === 200) {
      const doctors = response.data.Result;
      setDoctors(doctors);
    }else{
      console.log("errrrooorrrrr");
    }
  }
  const saveFilter = (event) => {
    setSpeciality('');
    setName('');
    filterDoctors();
    handleClick(event);
  }
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
 

  useEffect(() => {
    // Fetch initial data
    getDoctors();
  }, []);

  return (
    <div>
     <PatientNavBar/>
      
      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', height:'50px', marginTop:'10px'}}>
      <InputGroup className="mb-1" style={{width:'50%'}}>
      <Form.Control
       id="docName"
       onChange={(e) => setName(e.target.value)}        
          type="search"
          placeholder="Doctor's Name"
          aria-label="Doctor's Name"
          value={Name}
          size="small"
        />
        <Form.Control
          id="docspeciality"
          type="search"
          placeholder="Doctor's Speciality"
          aria-label="Doctor's Speciality"
          value={Speciality}
          size="small"
          onChange={(e) => setSpeciality(e.target.value)}
        />
        <Button
          variant="outline-secondary"
          title="Search"
          id="segmented-button-dropdown-1"
          size="small"
          onClick={handleSearch} 
        >
          Search
         
        </Button>
       </InputGroup>


      <Button variant="outline-dark"  style={{ marginRight: '50px' }}  onClick={handleClick} >
      <FilterListIcon />
        Filter
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <StyledPopperDiv>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        
        <DateTimePicker
        
          label="Start Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
        />
       
        <FormControl fullWidth>
         <InputLabel id="demo-simple-select-label">Speciality</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={specialityFilter}
            label="speciality"
            
            onChange={(e) => setSpecialityFilter(e.target.value)}          
          >
     <MenuItem value=''>any</MenuItem>        
    <MenuItem value='speciality1'>speciality1</MenuItem>
    <MenuItem value='speciality2'>speciality2</MenuItem>
    <MenuItem value='speciality3'>speciality3</MenuItem>
    <MenuItem value='speciality4'>speciality4</MenuItem>
    <MenuItem value='speciality5'>speciality5</MenuItem>

  </Select>
  </FormControl>
  <div>
  <Button variant="outline-dark" style={{ width: '45%',marginRight:'5%' }} onClick={saveFilter}>
      Save
    </Button>
    <Button variant="outline-dark" style={{ width: '45%' }} onClick={resetFilter}>
      Reset
    </Button>
  </div>
          </DemoContainer>
    </LocalizationProvider>
        </StyledPopperDiv>
      </Popper>

      </div>
      <br></br>
      <br></br>

      <Table striped bordered hover>
        <thead>
        <tr>
                  
                  <th colSpan={6} style={{ fontSize: '24px' }}>Doctors List</th>
                 

            </tr>
          <tr>
            <th>Name</th>
            <th>Speciality</th>
            <th>Session Price</th>
          
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, index) => (
            <tr key={index}>
              {/* Render doctor details here */}
              <td>{doctor.Name}</td>
              <td>{doctor.Speciality}</td>
              <td>{doctor.sessionPrice}</td>
             

              <td>
                <Button
                  variant="dark"
                  style={{ width: '45%' }}
                  //onClick={() => navigate(`/ViewDoctorInfo?Id=${doctor.id}`)}
                  onClick={() => {setCurInd(index); setModalShow(true); }}
                 // onClick={() => navigate(`/reschedule`)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      
    </div>
  );
};

export default DoctorsList;