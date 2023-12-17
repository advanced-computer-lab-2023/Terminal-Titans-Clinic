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
import {DoctorNavBar} from '../components/doctorNavBar';








// ----------------------------------------------------------------------

const   AllPresDoc = () => { 

  const [aptmnts,setAptmnts] = useState([]);
  const [startDate, setStartDate] = useState(dayjs(''));
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [curId, setCurId] = React.useState('');
  const [cancel,setisCancel]=React.useState(false);
  
    const [prescriptions, setPrescriptions] = useState([]);
    const [curPres, setCurPres] = useState(null);
    const [curDoc, setCurDoc] = useState(null);
    const [enable, setEnable] = useState(true);
 
  const getPres = async () => {
    setEnable(false);
    const response = await axios.post(
      `http://localhost:8000/doctor/getAllPrescriptions`,
      {  },
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );
    if (response.status === 200) {
      const data = response.data;
      console.log(data)
      setPrescriptions(data.final);
    
        
      
    
      }
    }
    const generatePdf = async (ind) => {
        setEnable(false);
       
        await axios.get(`http://localhost:8000/doctor/generatePdf/${prescriptions[ind].id}`, {
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
          Prescription Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
      
      <form>
                       
                       <input type="text" id="name"  style={{width: "50%", border:"0px", padding:'8px'}} value='Patient Name' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={prescriptions[curId]?.Name} readOnly />

                        <input type="text" id="Date"  style={{width: "50%", border:"0px", padding:'8px'}} value='Prescription Date' readOnly />
                        <input type="text" id="Date"  style={{width: "50%", border:"0px", padding:'8px'}} value={prescriptions[curId]?.Date?.substring(0,10)} readOnly />

                        <input type="text" id="Status"  style={{width: "50%", border:"0px", padding:'8px'}} value='Status' readOnly />
                        <input type="text" id="Status"  style={{width: "50%", border:"0px", padding:'8px'}} value={prescriptions[curId]?.status} readOnly />
                      
                        <Table striped bordered hover >
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th   >Dosage</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions[curId]?.medicine.map((pres, index) => (
                  <tr>
                    <React.Fragment key={index}>
                      <td>{pres?.Name}</td>
                      <td  >{pres?.Dosage}</td>
                      
                       </React.Fragment>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* <p><a href={curDoc} download="your-filename.pdf">Download Health Doc</a></p>
                 <iframe src={curDoc} style={{width:'100%',height:'500px'}}></iframe> */}
                 <div style={{ width: "100%", display: 'flex', justifyContent: 'flex-end' }}>
   {enable?
                <Button variant="dark" style={{  width: '47%',marginRight:'5%' }} href={curDoc} download="Prescription.pdf">
                Download PDF
                
                  </Button>:null}
               {prescriptions[curId]?.status==='not filled'?
                  <Button variant="dark" style={{ width: '47%' }} onClick={() => {  window.location.href = `/Health-Plus/addPresc?Id=${prescriptions[curId]?.id}`; }}>
                    Edit Prescription
                  </Button>:null}
                  </div>

                </form>
  
    
        </Modal.Body>
      </Modal>
    );
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

 
  

  
  useEffect(() => {
    getPres();
  
  }, []);

    return (
        <div>
          <DoctorNavBar></DoctorNavBar>    
   
    

        <Table striped bordered hover >
            <thead >
            <tr>
                  
                  <th colSpan={6} style={{ fontSize: '24px' }}>Prescription List</th>
                 

            </tr>
              <tr>
                <th>Patient Name</th>
                
                <th>Date</th>
                
                <th>Status</th>
                <th>View </th>

              </tr>
            </thead>
            <tbody>
                {prescriptions.map((aptmnt, index) => (
                    <tr>
                        <React.Fragment key={index}>
                         
                            <td>{aptmnt?.Name}</td>
                            <td>{aptmnt?.Date.substring(0,10)}</td>
                            <td>{aptmnt?.status}</td>
                            <td><Button variant="dark" style={{ width: '45%' }}   onClick={() => {generatePdf(index);setCurId(index); setModalShow(true);}}>
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

export default  AllPresDoc;