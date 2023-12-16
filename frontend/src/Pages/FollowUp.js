import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { get } from 'mongoose';
import {PatientNavBar} from '../components/PatientNavBar.jsx';

//not finished yet
export default function FollowUp() {
    const params = new URLSearchParams(window.location.search);
    const appId = params.get('Id');
    const [value, setValue] = React.useState(dayjs());
    const [freeSlots, setFreeSlots] = React.useState([]);
    const [isHovered, setIsHovered] = useState([]);
  
    const getSlots = async () => {
  
        await axios.get(`http://localhost:8000/patient/getAllFreeSlots2/${appId}`, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")//the token is a variable which holds the token
        }
      }).then(
        (res) => {

            const data = res.data;
            setFreeSlots(data);
            console.log(data);
        });     

      };

      const reschedule=async(date)=>{
    
        const response = await axios.post(
            `http://localhost:8000/patient/followup/${appId}`,
            {date},
            { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
          );
          if (response.status === 200) {
           alert("Follow Up request sent  successfully");
           window.location.href = '/Health-Plus/viewAppointments';
           

          }
      
    }
     
      const viewSlots = () => {
        

        const dateTemp=value.toDate();
        var valDay=dateTemp.getDate();
        var valMonth=dateTemp.getMonth()+1;
        const valYear=dateTemp.getFullYear();
        

        if(valMonth<10)
            valMonth="0"+valMonth;
        if(valDay<10)
            valDay="0"+valDay;
            const keyDate=valYear+"-"+valMonth+"-"+valDay;

        var allSlots = new Array(48).fill(false);
        if(freeSlots[keyDate]){
            freeSlots[keyDate].forEach(element => {
                
               
                const hour=element.substring(11,13);
                const min=element.substring(14,16);
              
                const index=hour*2+min/30;
                allSlots[index]=true;
                
            });
        }
        console.log(allSlots);
        const options = [];
        for (let i = 0; i <= 23; i++) {
            for (let j = 0; j < 60; j += 30) {
                let slot = i +":";
                if(i<10)
                slot="0"+slot;
                if(j==0)
                slot=slot+"00";
                else
                slot=slot+"30";
                if (allSlots[i*2 + j / 30]) {
                    
                    let inputDate=valYear+"-"+valMonth+"-"+valDay+"T"+slot+":00.000Z";

                    options.push(        
            <ListItem style={{width:'80%',marginBottom:'2px'}} key={i*2+j/30} disablePadding >
            
            <Button variant="outline-dark"               
            style={{ float: 'right' ,width:'100%'}} 
            onClick={()=>reschedule(inputDate)}
            onMouseEnter={() => 
                 setIsHovered(currentIsHovered => {
                  const newIsHovered = [...currentIsHovered]; // Create a copy of the current state
                  newIsHovered[i*2 + j / 30] =true; // Modify the copy
                  return newIsHovered; // Return the new state
                })}
            onMouseLeave={() => setIsHovered(currentIsHovered => {
                const newIsHovered = [...currentIsHovered]; // Create a copy of the current state
                newIsHovered[i*2 + j / 30] =false;
               return newIsHovered; // Return the new state
              })}>
               {isHovered[i*2 + j / 30] ? 'Choose' : slot}
                
                </Button>
          </ListItem>
                  );
                }
            }
        }
        return options;
      }
  
    useEffect(() => {
        getSlots();
        viewSlots();
        var  temp=new Array(48).fill(false);
        setIsHovered(temp);
        //viewSlots();
    }, [value]);
    return (
        <div>
            <PatientNavBar/>
            <div style={{}}>
            <h1 style={{}}>Choose Date to reschedule</h1>
            </div>
        <div style={{display:'flex',height:'10%'}}>
        <div style={{width:'50%'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={[
           
            'StaticDatePicker'
          ]}
        >
       <DemoItem >
  <StaticDatePicker value={value} disablePast onChange={(newValue) => setValue(newValue)}/>
</DemoItem>
        </DemoContainer>
      </LocalizationProvider>
        <br></br>
    </div>
    <div style={{width:'40%',height:'60vh',overflow:'auto',marginTop:'100px',marginLeft:'10%'}}>
    <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
        
            '& .MuiDrawer-paper': { boxSizing: 'border-box' ,position:'inherit'},
          }}
          open
        >
          <List>
    {viewSlots()}
    </List>
        </Drawer>
  
</div>
</div>
    </div>
    );
  }