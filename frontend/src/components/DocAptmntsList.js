import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';  
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import React ,{useEffect,useState} from 'react';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// const { useState } = require("react");

const DocAptmntsList = () => { 

  const params=new URLSearchParams(window.location.search);
  const [file, setFile] = useState(null);
  const [bData, setBData] = useState(null);
  const [Pt, setPt] = useState([]);
  const[id,setID]=useState(null);
  const [aptmnts,setAptmnts] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('');
  const [availableTime, setAvailableTime]= useState('');
  const [buttonColor, setButtonColor] = useState('primary');
  const [date, setDate]= useState(null);
  

  useEffect(() => {
    // setID(aptmnts.PatientId)
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryString = e.target.result;
        setBData(binaryString);
      };
      reader.readAsBinaryString(file);
      setFile(file);
    }
  }, [file]);

  const getAptmnts = async () => {
    const response = await axios.post(
      `http://localhost:8000/doctor/getAppointment`,
      { startDate, endDate, status },
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );
    if (response.status === 200) {
      const aptmnts = response.data;
      //  id=response.data.PatientId;
      //  console.log(id);
      //  setID(id);
      console.log(aptmnts);
      setAptmnts(aptmnts);
    }
  }





//addavailableSlot with the dateTime picked using availableDateTime
  const addAvailableSlot = async () => {
    const date = document.getElementById("availableDateTime").value;
    console.log(date);
    setAvailableTime(date);
    const response = await axios.post(
      `http://localhost:8000/doctor/addavailableslots`,
      { date },
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );
    if (response.status === 200) {
      console.log(response.data);
    }
  }
// const handleAddClick = (event) => {
//       const row = event.target.closest('tr');
//       const patientId = row.dataset.patientId;
//       setID(patientId);
//       console.log("PAAAATTTTIIIEEENNNTTTT "+patientId);
// }
  const addrec = async (PatientId) => {
   // handleAddClick();
    const formData = new FormData();
    // const pat=aptmnts.PatientId;

      formData.append('file', file);
      // formData.append('id',idd);
    //  axios.post(
    //   `http://localhost:8000/doctor/addrecord/${aptmnts.PatientId}`,
    //   formData,
    //   { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    // );
    const response = await axios.post(
      `http://localhost:8000/doctor/addrecord/${PatientId}`,
      formData,
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
  );
    // if (response.status === 200) {
      // console.log(response.data);
    // }
  }


  const followup = async (PatientId,date) => {
   

     const response = await axios.post(
       `http://localhost:8000/doctor/assignfollowUp`,
       {PatientId,date},
       { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
   );
     // if (response.status === 200) {
       // console.log(response.data);
     // }
   }

  return(
    <div className="UsersList">
      <Box sx={{marginBottom: 2}}>
        <Stack spacing={3} direction="row">
          <form action="/action_page.php">
            <label htmlFor="availableSlots">Enter your available time slots:</label>
            <input type="datetime-local" id="availableDateTime" name="availableTime" />
            <input type="submit" onClick={addAvailableSlot} margin="normal" padding="normal"/>
          </form>
          <TextField
            select
            label="Select Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
            }}
            helperText="Please select status"
          >
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="rescheduled">Rescheduled</MenuItem>
          </TextField>
          <Button variant="contained" onClick={getAptmnts} margin="normal" padding="normal">Load Appointments</Button>
        </Stack>
        
        <input
            type="Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        <input
            type="Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Patient</StyledTableCell>
              <StyledTableCell align="center">Assign a followup</StyledTableCell>
              <StyledTableCell align="center">health Records</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aptmnts.map((aptmnts) => (
              <TableRow
                hover
                sx={{
                  "&:hover":{
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5",
                    width: "100%"
                  }
                }}
                // onClick={() => window.location.href=`/filter?userId=${aptmnts._id}`}
                // key={aptmnts._id}
              >
                <TableCell align="center">{aptmnts.Date}</TableCell>
                <TableCell align="center">{aptmnts.Status}</TableCell>
                <TableCell align="center">{aptmnts.Name}</TableCell>
                <TableCell align="center">
      <InputGroup className="mb-3">
        
        
        <input type="date" onChange={(e) => setDate(e.target.value)} id="availableDateTime" name="availableTime" /> 

        
        <Button variant="outline-secondary" onClick={()=>followup(aptmnts.PatientId,date)} id="button-addon2">
          add
        </Button>
      </InputGroup> </TableCell>
                <TableCell align="center"> 
                <InputGroup className="mb-3">
        {/* <Form.Control
          type="file"
          name="file"
          accept=".pdf"
          onChange={(e) => {
            console.log(e.target.files[0]);
            setFile(e.target.files[0]);
            console.log(file); // Check if files state is updated
          }}
        /> */}

        <Form.Control 
        type="file"
         size="md" 
        name="file"
        justify="center"
        accept=".pdf"
        onChange={(e) => {
          console.log(e.target.files[0]);
          setFile(e.target.files[0]);
          console.log(file); // Check if files state is updated
        }}
        />

        <Button variant="primary" size="sm" onClick={() => addrec(aptmnts.PatientId)}>Add</Button>
      </InputGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default DocAptmntsList;
