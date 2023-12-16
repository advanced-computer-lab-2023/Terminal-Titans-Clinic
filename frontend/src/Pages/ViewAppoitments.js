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
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Modal from 'react-bootstrap/Modal';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { set } from 'mongoose';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { styled as styled2 } from '@mui/material/styles';
import { styled as styled3 } from '@mui/material/styles';
import {PatientNavBar} from '../components/PatientNavBar.jsx';







// ----------------------------------------------------------------------

const   DocViewAppointments = () => { 

  const [aptmnts,setAptmnts] = useState([]);
  const [startDate, setStartDate] = useState(dayjs(''));
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [curId, setCurId] = React.useState('');
  const [cancel,setisCancel]=React.useState(false);
  
 




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
const cancelfunc=async()=>{
   console.log(aptmnts[curId])
    const response = await axios.put(
        `http://localhost:8000/patient/cancelAppointment/${aptmnts[curId]?.id}`,
        {},
        { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
      );
      if (response.status === 200) {
        const aptmnts = response.data;
        setAptmnts(aptmnts);
        setisCancel(false);
        setModalShow(false);
        setEndDate('');
        setStartDate('');
        setStatus('');

      }
  
}


  function MyVerticallyCenteredModal(props) {
    
   
    
    if(cancel)
    return(
    <Modal
    {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
      Appointment Details
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <h4>Are you sure you want to cancel this Appointment?</h4>
<br></br>

<Button variant="dark" style={{ width: '48%',marginRight:'4%',marginTop:'4%' }} onClick={cancelfunc}>
Yes</Button>
<Button variant="dark" style={{ width: '48%' ,marginTop:'4%'}} onClick={() => {setisCancel(false) }}>
No</Button>
    </Modal.Body>
  </Modal>
    );
   
    if(!cancel)
    console.log(curId);
    return (
    
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          Appointment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
                     <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}  >Doctor Name:</label> 
                        <label  style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{aptmnts[curId]?.Name}</label>
                        <br></br>
                        {aptmnts[curId]?.familyMember ?
                        <>
                         <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>Family Member:</label>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{aptmnts[curId]?.famMem}</label> 
                        <br></br> </>: <></>}
                        
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>Appointment Date:</label>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{aptmnts[curId]?.Date.substring(0,10)}</label>
                        <br></br>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>Appointment Time:</label>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{aptmnts[curId]?.Date.substring(11,16)}</label>
                        <br></br>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>Appointment Status:</label>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{aptmnts[curId]?.Status}</label>
                        <br></br>
                        
                        {aptmnts[curId]?.Status=='completed'?
                        <>
                        
                         <Button variant="dark" style={{ width: '100%' }}onClick={() => window.location.href=`/Health-Plus/followUp?Id=${aptmnts[curId]?.id}`}>
                        Shdeule Follow Up</Button>
                       
                         </>:<></>}
                         {aptmnts[curId]?.Status=='upcoming'?
                         <>
                        
                        <Button variant="dark" style={{ width: '48%',marginRight:'4%',marginTop:'4%' }} onClick={() => window.location.href=`/Health-Plus/reschedule?Id=${aptmnts[curId]?.id}`}>
                        reschedule</Button>
                        <Button variant="dark" style={{ width: '48%' ,marginTop:'4%'}}  onClick={() => {setisCancel(true);}}>
                        Cancel</Button>
                        </>
                        :<></>}
                    </form>
        </Modal.Body>
      </Modal>
    );
  }



    const getAptmnts = async () => {
      const response = await axios.post(
        `http://localhost:8000/patient/getAppointment`,
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
    getAptmnts();
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
          <PatientNavBar/>
   
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
    </Button>
    <Button variant="outline-dark" style={{ width: '45%' }} onClick={resetFilter}>
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
                  
                    <th colSpan={6} style={{ fontSize: '24px' }}>Appointment List</th>
                   

              </tr>
              <tr>
                <th>Doctor Name</th>
                <th>Family Member</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>View </th>

              </tr>
            </thead>
            <tbody>
                {aptmnts.map((aptmnt, index) => (
                    <tr>
                        <React.Fragment key={index}>
                         
                            <td>{aptmnt.Name}</td>
                            <td>{aptmnt.famMem?aptmnt.famMem:'-'}</td>
                            <td>{aptmnt.Date.substring(0,10)}</td>
                            <td>{aptmnt.Date.substring(11,16)}</td>
                            <td>{aptmnt.Status}</td>
                            <td><Button variant="dark" style={{ width: '45%' }}   onClick={() => {setCurId(index); setModalShow(true); setisCancel(false); }}>
                                View 
                              </Button></td> 

                              </React.Fragment> 
                    </tr>
                ))}
            </tbody>
        </Table >
        <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
        </div>
    );
}

export default DocViewAppointments;