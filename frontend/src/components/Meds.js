import "../Styles/Meds.css";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import axios from 'axios';
import FormLabel from '@mui/material/FormLabel';
import PrescItem from './PrescItem';


const Meds = ({ medicines }) => {

  const params = new URLSearchParams(window.location.search);
  const prescId = params.get('Id');
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(1);
  const [prescItems, updatePrescItems] = useState([]);
  // const [ selectedDosage, setSelectedDosage ] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedDosage, setSelectedDosage] = useState(1);
  const [patientId, setPatientId] = useState(null);

  // useEffect(() => {
  //   fetchData();
  // }, []);


  // if (!medicines || !Array.isArray(medicines)) {
  //   return null; // or handle this case in a way that makes sense for your application
  // }

  // get the prescription of the id
  // const getPrescription = async () => {
  //   try {
  //     console.log('res');
  //     const response = await axios.get(`http://localhost:8000/doctor/getPatientOfPrescription/${prescId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
  //     if (response.status === 200) {
  //       console.log('Successfully fetched patient.');
  //       console.log(response.data.Result.result);
  //       setPatientId(response.data.Result.result._id);
  //       console.log(patientId);
  //     } else {
  //       console.error('Failed to fetch patient. Unexpected response:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }


  // const getPatient = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:8000/doctor/getPatientOfPrescription/${prescId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
  //     if (response.status === 200) {
  //       console.log('Successfully fetched patient.');
  //       console.log(response.data.Result.result);
  //       setPatientId(response.data.Result.result._id);
  //     } else {
  //       console.error('Failed to fetch patient. Unexpected response:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }


  const handlePrescItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/doctor/getPrescMeds/${prescId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      if (response.status === 200) {
        console.log('Successfully fetched prescription items.');
        console.log(response.data);
        // updatePrescItems(response.data.Result.result);

      } else {
        console.error('Failed to fetch prescription items. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // const fetchData = async () => {
  //   await getPrescription();
  //   await getPatient();
  //   await handlePrescItems();
  // };




  const handleDosageChange = (event) => {
    const newDosage = parseInt(event.target.value);
    setSelectedDosage(newDosage);
  };


  const handleAddToprescription = async (medicine, dosage) => {
    handleClose();
    console.log(medicine);
    console.log(dosage);
    try {
      const response = await axios.post('http://localhost:8000/doctor/addOrDeleteMedFromPresc', {
        medicineId: medicine._id,
        action: 'add',
        prescriptionId: prescId,
        dosage: dosage
      }, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      if (response.status === 200) {
        console.log('Successfully added medicine to prescription.');
        window.location.reload();
      } else {
        console.error('Failed to add medicine to prescription. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // //update dosage of the specified medicine in the dosage specified
    // try {
    //   const response = await axios.post('http://localhost:8000/doctor/updateDosage', {
    //     medicineId: medicine._id,
    //     dosage: dosage,
    //     prescriptionId: prescId
    //   }, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });

    //   if (response.status === 200) {
    //     console.log('Successfully updated dosage of medicine.');

    //   } else {
    //     console.error('Failed to update dosage of medicine. Unexpected response:', response);
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  }
  return (
    <div>
            <div className="Medcines">
              {medicines.map((medicine) => (
                <div key={medicine._id} className="medicine">
                  {medicine.Picture && medicine.Picture.data && medicine.Picture.contentType && (
                    <img
                      src={`data:${medicine.Picture.contentType};base64,${arrayBufferToBase64(medicine.Picture.data.data)}`}
                      alt={medicine.Name}
                    />
                  )}
                  <div className="meds_info">
                    <p className="info_name">{medicine.Name}</p>
                    <p className="infooo">{medicine.MedicalUse.join(' ')}</p>
                    <Button className="info_buttom" onClick={handleShow}>
                      View
                    </Button>

                  </div>
                  <Modal  aria-labelledby="contained-modal-title-vcenter"
    centered show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>{medicine.Name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <h5>Medicine Details:</h5>
                      {medicine.MedicalUse.join(' ')}
                    <div style={{ marginTop:"10%"}}>
                    <h5>Please enter the desired dosage:</h5>

                    <div style={{display:"flex", marginTop:"0%"}}>
                  
                    <input type="text"  style={{width:'100px', border:"0px"}} value="Dosage:" readOnly />
                         <select
        className="presc_select"
        value={value}
        onChange={(e) => setValue(value)}
      >
        {[...Array(20).keys()].map((option) => (
          <option key={option + 1} value={option + 1}>
            {option + 1}
          </option>
        ))}
      </select>
      </div>
                      </div>
                      </Modal.Body>
                    <Modal.Footer>
                     
                      <Button variant="primary" onClick={() => { handleAddToprescription(medicine, value) }}>
                        Add to Prescription
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              ))}
            </div>
    </div>

  );
};

export default Meds;

// Utility function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

