import "../Styles/addPresc.css"
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Meds from "../components/Meds";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SplitButton from 'react-bootstrap/SplitButton';
import { Link } from 'react-router-dom';
import PrescItem from '../components/PrescItem';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';

import Toolbar from '@mui/material/Toolbar';
import { DoctorNavBar } from "../components/doctorNavBar";

const drawerWidth = 300;
const AddPresc = () => {
  const params = new URLSearchParams(window.location.search);
  const prescId = params.get('Id');
  const [allMedicines, setAllMedicines] = useState([]);
  const [medicalUses, setMedicalUses] = useState([]);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [prescItems, updatePrescItems] = useState([]);
  const [selectedDosage, setSelectedDosage] = useState(1);
  const [patientId, setPatientId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [patName, setPatName] = useState('');
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const getMedicines = async () => {
      try {
        const response = await fetch('http://localhost:8000/Doctor/getAllMedicines', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
        const jsonData = await response.json();

        if (Array.isArray(jsonData.meds)) {
          setAllMedicines(jsonData.meds);
        }
        else {
          console.error('Invalid data format. Expected an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getMedicines();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);


  // if (!medicines || !Array.isArray(medicines)) {
  //   return null; // or handle this case in a way that makes sense for your application
  // }

  // get the prescription of the id
  const getPrescription = async () => {
    try {
      console.log('res');
      const response = await axios.get(`http://localhost:8000/doctor/getPrescription/${prescId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      if (response.status === 200) {
        console.log('Successfully fetched presc.');
        console.log(response.data);
        setPatientId(response.data.Result._id);
        console.log(patientId);
      } else {
        console.error('Failed to fetch patient. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  const getPatient = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/doctor/getPatientOfPrescription/${prescId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      if (response.status === 200) {
        console.log('Successfully fetched patient.');
        console.log(response.data);
        setPatientId(response.data.patient._id);
        setPatName(response.data.patient.Name);
      } else {
        console.error('Failed to fetch patient. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  const handlePrescItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/doctor/getPrescMeds/${prescId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      if (response.status === 200) {
        console.log('Successfully fetched prescription items.');
        console.log(response.data.Result);
        updatePrescItems(response.data.Result);

      } else {
        console.error('Failed to fetch prescription items. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const fetchData = async () => {
    await getPrescription();
    await getPatient();
    await handlePrescItems();
  };




  const handleDosageChange = (event) => {
    const newDosage = parseInt(event.target.value);
    setSelectedDosage(newDosage);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const medicalUsesResponse = await axios.get('http://localhost:8000/Doctor/getAllMedicalUses', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
        if (medicalUsesResponse.status === 200) {
          setMedicalUses(medicalUsesResponse.data.medicalUses);
        } else {
          console.error('Failed to get medical uses. Unexpected response:', medicalUsesResponse);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch initially
    fetchData();
    // Poll for updates every 5 seconds (adjust the interval as needed)
    //const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on component unmount
    //return () => clearInterval(intervalId);
  }, []); // Runs once on mount




  
  const drawer = (
    console.log(prescItems),
    <div>
      <Toolbar />
      <List>
      <div   style={{ width: "100% ",backgroundColor:'black', padding:'3%',marginBottom:'5px' }}>
           
           <h3 style={{color:'white', textAlign:'center'}}>{patName}'s Prescription </h3>
           </div>
     
      <input type="text" style={{ width: '150px', border: "0px", fontWeight: 'bold' }} value="   medicine" readOnly />
      <input type="text" style={{ width: '60px', border: "0px", fontWeight: 'bold' }} value="#" readOnly />
      <input type="text"  style={{width:'80px', border:"0px", fontWeight: 'bold'}} value="delete"readOnly />
      <Divider />
                   {prescItems.map((item) => (
                    <>
                    <PrescItem key={item.med._id} item={item}  />
                    <Divider />
                    </>
                  ))}
                
                <Button variant="dark" style={{ width: '90%',marginLeft:'5%',marginTop:'4%' }} onClick={() => window.location.href=`/Health-Plus/viewMyPatientInfo?Id=${patientId}&presId=${prescId}`} >
Save Prescription</Button>
                  {/* <button onClick={() => window.location.pathname = `../Pages/viewMyPatientProfile/${patientId}`}>Back to Patient Profile</button> */}
               
       

      </List>
      

    </div>
  );
  return (
    
      
    
require("../Styles/ViewMyInfo.css"),
<>
{errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
  <DoctorNavBar />
  <Box sx={{ display: 'flex' }}>

    <Box
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, height: '100vh', overflow: 'auto' }}
    >
      <div className="homescreen_meds">
              {Array.isArray(allMedicines) ? (
                allMedicines.map((medicine) => <Meds key={medicine.Name} medicines={[medicine]} />)
              ) : (
                <p>Error: Medicines data is not in the expected format.</p>
              )}
            </div>
    </Box>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open
    >
      {drawer}
    </Drawer>

  </Box>
</>
  );
};

export default AddPresc;

