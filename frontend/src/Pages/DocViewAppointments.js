import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Popper } from '@mui/base/Popper';
import { styled, css } from '@mui/system';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';



// ----------------------------------------------------------------------

const   DocViewAppointments = () => { 

  const [aptmnts,setAptmnts] = useState([]);
  const [startDate, setStartDate] = useState(dayjs(''));
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

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
     

    const getAptmnts = async () => {
      const response = await axios.post(
        `http://localhost:8000/doctor/getAppointment`,
        { startDate, endDate, status },
        { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
      );
      if (response.status === 200) {
        const aptmnts = response.data;
        console.log(endDate);
        setAptmnts(aptmnts);
      }
    }

   
  const resetFilter = (event) => {
    setStartDate('');
    setEndDate('');
    setStatus('');
    handleClick(event);

    
  }
  const saveFilter = (event) => {
    getAptmnts();
    handleClick(event);
  }
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  useEffect(() => {
    getAptmnts();
  }, []);

    return (
        <div>
    <h1>Appointments List</h1>
    <Button variant="outline-dark" style={{ float: 'right' }} onClick={handleClick}>
      <FilterListIcon />
      Filter
    </Button>
    <Popper id={id} open={open} anchorEl={anchorEl}>
        <StyledPopperDiv>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        
        <DateTimePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
        />
        <DateTimePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
        />
        <FormControl fullWidth>
         <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="Status"
            
            onChange={(e) => setStatus(e.target.value)}          
          >
     <MenuItem value=''>any</MenuItem>        
    <MenuItem value='upcoming'>upcoming</MenuItem>
    <MenuItem value='completed'>completed</MenuItem>
    <MenuItem value='cancelled'>cancelled</MenuItem>
    <MenuItem value='rescheduled'>rescheduled</MenuItem>

  </Select>
  </FormControl>
  <div>
  <Button variant="outline-dark" style={{ width: '45%',marginRight:'5%' }} onClick={saveFilter}>
      Save
    </Button><Button variant="outline-dark" style={{ width: '45%' }} onClick={resetFilter}>
      Reset
    </Button>
  </div>
          </DemoContainer>
    </LocalizationProvider>
        </StyledPopperDiv>
      </Popper>

    
<br></br>
<br></br>
        <Table striped bordered hover >
            <thead >
              <tr>
                <th>Patient Name</th>
                <th>Family Member</th>
                <th>Date</th>
                <th>Status</th>
                <th>View </th>

              </tr>
            </thead>
            <tbody>
                {aptmnts.map((aptmnt, index) => (
                    <tr>
                        <React.Fragment key={index}>
                         
                            <td>{aptmnt.Name}</td>
                            <td>{aptmnt.FamMem?aptmnt.FamMem:'-'}</td>
                            <td>{aptmnt.Date?.substring(0,10)}</td>
                            <td>{aptmnt.Status}</td>
                            <td><Button variant="dark" style={{ width: '45%' }} >
                                View
                              </Button></td> 
                              </React.Fragment> 
                    </tr>
                ))}
            </tbody>
        </Table >
        </div>
    );
}

export default DocViewAppointments;