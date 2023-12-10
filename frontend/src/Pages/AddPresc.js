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

const AddPresc = () => {
  const params = new URLSearchParams(window.location.search);
  const prescId = params.get('Id');
  const [allMedicines, setAllMedicines] = useState([]);
  const [medicalUses, setMedicalUses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getMedicines = async () => {
      try {
        const response = await fetch('http://localhost:8000/Doctor/getAllMedicines', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
        const jsonData = await response.json();

        if (Array.isArray(jsonData.meds)) {
          setAllMedicines(jsonData.meds);
        } else {
          console.error('Invalid data format. Expected an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getMedicines();
  }, []);

  // adds the specified medicine from the button to the prescription in the params and updates the dosage to the specified dosage that he chose
  const handleAddToprescription = async (medicine, dosage) => {
    try {
      const response = await axios.post('http://localhost:8000/doctor/addOrDeleteMedFromPresc', {
        medicineId: medicine._id,
        action: 'add',
        prescriptionId:prescId
      }, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      console.log('Here');
      if (response.status === 200) {
        console.log('Successfully added medicine to prescription.');
      } else {
        console.error('Failed to add medicine to prescription. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    //update dosage of the specified medicine in the dosage specified
    try {
      const response = await axios.post('http://localhost:8000/doctor/updateDosage', {
        medicineId: medicine._id,
        dosage: dosage,
        prescriptionId:prescId
      }, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });

      if (response.status === 200) {
        console.log('Successfully updated dosage of medicine.');
      } else {
        console.error('Failed to update dosage of medicine. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


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
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Runs once on mount

  return (
    <div>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="addPresc">
        <h2 className="addPresc_title">Meds</h2>
        <div className="addPresc_meds">
          {Array.isArray(allMedicines) ? (
            allMedicines.map((medicine) => <Meds key={medicine.Name} medicines={[medicine]} />)
          ) : (
            <p>Error: Medicines data is not in the expected format.</p>
          )}
          <button type="button" onClick={handleAddToprescription(medicine,)} >
                            Add to prescription
                        </button>
        </div>
        
      </div>
      {/* <Button variant="primary" onClick={window.location.href=`/Health-Plus/prescInfo?Id=${prescId}`}>
                Cart <Badge bg="secondary">{cartItemCount}</Badge>
              </Button> */}
    </div>
    
  );
};

export default AddPresc;
