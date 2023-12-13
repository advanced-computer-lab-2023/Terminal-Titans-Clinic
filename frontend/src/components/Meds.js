import "../Styles/Meds.css";
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import axios from 'axios';
import FormLabel from '@mui/material/FormLabel';



const Meds = ({ medicines }) => {
    const params = new URLSearchParams(window.location.search);
    const prescId = params.get('Id');
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(1);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    if (!medicines || !Array.isArray(medicines)) {
        return null; // or handle this case in a way that makes sense for your application
      }

      const handleAddToprescription = async (medicine, dosage) => {
        handleClose();
        console.log(medicine);
        console.log(dosage);
        try {
          const response = await axios.post('http://localhost:8000/doctor/addOrDeleteMedFromPresc', {
            medicineId: medicine._id,
            action: 'add',
            prescriptionId:prescId
          }, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
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
  return (
    <div className="Medcines">
      {medicines.map((medicine) => (
        <div key={medicine.id} className="medicine">
          {medicine.Picture && medicine.Picture.data && medicine.Picture.contentType && (
            <img
              src={`data:${medicine.Picture.contentType};base64,${arrayBufferToBase64(medicine.Picture.data.data)}`}
              alt={medicine.Name}
            />
          )}
          <div className="meds_info">
            <p className="info_name">{medicine.Name}</p>
            <p className="infooo">{medicine.MedicalUse.join(' ')}</p>
            <p className="price">${medicine.Price}</p>
            <Button className="info_buttom" onClick={handleShow}>
              View
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{medicine.Name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{medicine.MedicalUse.join(' ')}</Modal.Body>
                <Modal.Footer>
                  <FormLabel for="dosage">Dosage:</FormLabel>
                <NumberInput
                    style={{ width: '80%' }}
                    aria-label="Demo number input"
                    placeholder="Enter Dosage…"
                    value={value}
                    onChange={(event, val) => setValue(val)}
                    min={1} max={99}
                />
                <Button variant="primary" onClick={()=>{handleAddToprescription(medicine,value)}}>
                    Add to Prescription
                </Button>
                </Modal.Footer>
            </Modal>
          </div>
        </div>
      ))}
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

