// import React from "react";
import "../Styles/LoginForm.css";
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

function ViewAppInfo() {
    const params = new URLSearchParams(window.location.search);
    const appId = params.get('Id');
    const [appointment, setAppointment] = useState({});
    const [anchorFollowUp, setAnchorFollowUp] = React.useState(null);
    const [anchorReschedule, setAnchorReschedule] = React.useState(null);
    const [anchorCancel, setAnchorCancel] = React.useState(null);
    const [date, setDate] = useState(dayjs(''));
    const [patientId, setPatientId] = useState('');


const getAppointment=async()=>{
    await axios.get(`http://localhost:8000/doctor/getAppointment/${appId}`, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
        }
      }).then(
        (res) => {
          const InfoData = res.data.appointment
          console.log(InfoData)
         setAppointment(InfoData)
         setPatientId(InfoData.PatientId)
         console.log(InfoData.PatientId)
  
        }
      );
}
const followup=async()=>{
    const data={patientId,date}
    const FamilyMemId=appointment.FamilyMemId;
    console.log(patientId)
    const response = await axios.post(
        `http://localhost:8000/doctor/assignfollowUp`,
        {patientId,date,FamilyMemId},
        { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
      );
      if (response.status === 200) {
        window.location.href = '/Health-Plus/DocViewAppointments';

      }
  
}
const cancel=async()=>{
   
    // const response = await axios.post(
    //     `http://localhost:8000/doctor/assignfollowUp`,
    //     {},
    //     { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    //   );
    //   if (response.status === 200) {
    //     window.location.href = '/Health-Plus/DocViewAppointments';

    //   }
  
}
const reschedule=async()=>{
    const data={patientId,date}
    const FamilyMemId=appointment.FamilyMemId;
    console.log(patientId)
    const response = await axios.put(
        `http://localhost:8000/doctor/rescheduleAppointment/${appointment._id}`,
        {date},
        { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
      );
      if (response.status === 200) {
        window.location.href = '/Health-Plus/DocViewAppointments';

      }
  
}
useEffect(()=>{
    getAppointment();
    },[]
    )
    const handleClickFollowUp = (event) => {
        setAnchorFollowUp(anchorFollowUp ? null : event.currentTarget);
      };
      const handleClickReshedule = (event) => {
        setAnchorReschedule(anchorReschedule ? null : event.currentTarget);
      };
        const handleClickCancel = (event) => {
            setAnchorCancel(anchorCancel ? null : event.currentTarget);
        };
        const shouldDisableTime = (value, view) =>
         view === 'minutes' && !(value.minute() == 0|| value.minute() == 30);
    const openFollowUp = Boolean(anchorFollowUp);
    const idFollowUp = openFollowUp ? 'simple-popper' : undefined;
    const openReschedule = Boolean(anchorReschedule);
    const idReschedule = openReschedule ? 'simple-popper' : undefined;
    const openCancel = Boolean(anchorCancel);
    const idCancel = openCancel ? 'simple-popper' : undefined;


    const PopupBody = styled('div')(
        ({ theme }) => `
        width: max-content;
        padding: 12px 16px;
        margin: 8px;
        border-radius: 8px;
        border: 1px solid ${theme.palette.mode === 'dark' ? '#434D5B' :'#DAE2ED'};
        background-color: ${theme.palette.mode === 'dark' ? '#1C2025' : '#fff'};
        box-shadow: ${
          theme.palette.mode === 'dark'
            ? `0px 4px 8px rgb(0 0 0 / 0.7)`
            : `0px 4px 8px rgb(0 0 0 / 0.1)`
        };
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.875rem;
        z-index: 1;
      `,
      );
      function  FollowUpAppointmentPopUp() {
        return ( 
     <BasePopup id={idFollowUp} open={openFollowUp} anchor={anchorFollowUp} style={{marginTop:'-18%'}} placement='center'>
     <PopupBody style ={{padding:'50px'}}>
        <h4>Choose the day and time for the Follow Up:</h4>
        <br></br>
     <LocalizationProvider  dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker disablePast shouldDisableTime={shouldDisableTime} value={date}
            onChange={(newValue) => setDate(newValue)} label="Basic date time picker" />
        </DemoContainer>
        </LocalizationProvider>
        <Button variant="dark" style={{ width: '48%',marginRight:'4%',marginTop:'4%' }} onClick={followup}>
    Save</Button>
    <Button variant="dark" style={{ width: '48%' ,marginTop:'4%'}} onClick={handleClickFollowUp}>
    Cancel</Button>
        </PopupBody>
     </BasePopup>
    
    );
    }
    function  ReshudueleAppointmentPopUp() {
        return ( 
     <BasePopup id={idReschedule} open={openReschedule} anchor={anchorReschedule} style={{marginTop:'-20%'}}placement='center' >
     <PopupBody style ={{padding:'50px'}}>
        <h4>Choose the day and time to reschedule:</h4>
        <br></br>
     <LocalizationProvider  dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker disablePast shouldDisableTime={shouldDisableTime} value={date}
            onClose={(newValue) => setDate(newValue)} label="Basic date time picker" />
        </DemoContainer>
        </LocalizationProvider>
        <Button variant="dark" style={{ width: '48%',marginRight:'4%',marginTop:'4%' }} onClick={reschedule}>
    Save</Button>
    <Button variant="dark" style={{ width: '48%' ,marginTop:'4%'}} onClick={handleClickReshedule}>
    Cancel</Button>
        </PopupBody>
     </BasePopup>
    
    );
    }
    function  CancelAppointmentPopUp() {
        return ( 
     <BasePopup id={idCancel} open={openCancel} anchor={anchorCancel} style={{marginTop:'-15%',marginLeft:'-25%'}} placement='center'>
     <PopupBody style ={{padding:'50px'}}>
        <h4>Are you sure you want to cancel this Appointment?</h4>
        <br></br>
     
        <Button variant="dark" style={{ width: '48%',marginRight:'4%',marginTop:'4%' }} onClick={cancel}>
    Yes</Button>
    <Button variant="dark" style={{ width: '48%' ,marginTop:'4%'}} onClick={handleClickCancel}>
    No</Button>
        </PopupBody>
     </BasePopup>
    
    );
    }

   
    return (
        <div>
           
            <div id="login-form"  style={{ width: "600px " ,backgroundColor:"black"}}>
                <h1>Appointment Details</h1>
            <form>
                <CancelAppointmentPopUp/>

                <ReshudueleAppointmentPopUp/>
                <FollowUpAppointmentPopUp/>
                     <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}  >Patient Name:</label> 
                        <label  style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{appointment.Name}</label>
                        <br></br>
                        {appointment.familyMember ?
                        <>
                         <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>Family Member:</label>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{appointment.familyMember}</label> 
                        <br></br> </>: <></>}
                        
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>Appointment Date:</label>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{appointment.Date?.substring(0,10)}</label>
                        <br></br>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>Appointment Time:</label>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{appointment.Date?.substring(11,16)}</label>
                        <br></br>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>Appointment Status:</label>
                        <label style={{display:'inline-block',width:'50%',fontSize:'18px'}}>{appointment.Status}</label>
                        <br></br>
                        
                        {appointment.Status=='completed'?
                        <>
                        
                         <Button variant="dark" style={{ width: '100%' }} onClick={handleClickFollowUp}>
                        Shdeule Follow Up</Button>
                       
                         </>:<></>}
                         {appointment.Status=='upcoming'?
                         <>
                        
                        <Button variant="dark" style={{ width: '48%',marginRight:'4%',marginTop:'4%' }} onClick={handleClickReshedule}>
    reschedule</Button>
    <Button variant="dark" style={{ width: '48%' ,marginTop:'4%'}} onClick={handleClickCancel}>
    Cancel</Button>
                        </>
                        :<></>}
                        
                       
        
                    </form>
                   
            </div>
        </div>
    );
}


export default ViewAppInfo;