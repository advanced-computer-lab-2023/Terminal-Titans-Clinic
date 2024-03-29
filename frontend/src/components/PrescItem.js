
import "../Styles/PrescItem.css"
import "../Styles/LoginForm.css";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

const PrescItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [medicine, setMedicine] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const prescId = params.get('Id');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('http://localhost:8000/doctor/getAllMedicines/',{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}});
        const medicines = response.data.meds;

        const matchedMedicine = item.med;

        if (matchedMedicine) {
          setMedicine(matchedMedicine);
        }
      } catch (error) {
        console.error('Error fetching medicines data:', error);
      }
    };
    setQuantity(item.dosage);
    

    fetchMedicines();
  }, [item.med._id]);

  const handleQuantityChange = async (newQuantity) => {
    try {
      if (newQuantity==0){
        await axios.delete(`http://localhost:8000/doctor/addOrDeleteMedFromPresc`, { prescriptionId:prescId,medicineId:item.med._id,action:"delete"},{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}});
        window.location.reload();
      }
      else{
        await axios.put(`http://localhost:8000/doctor/updateDosage`, { prescriptionId:prescId,medicineId:item.med._id,dosage:newQuantity},{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}});
      setQuantity(newQuantity);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeletePrescItem = async () => {
    try {
      await axios.post(`http://localhost:8000/doctor/addOrDeleteMedFromPresc`, { prescriptionId:prescId,medicineId:item.med._id,action:"delete"},{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}});
      window.location.reload();
    } catch (error) {
      console.error('Error deleting presc item:', error);
    }
  };

  if (!medicine) {
    return <div>Loading or no data available for the medicine.</div>;
  }

  return (
    <div className="prescitem">
      {/* <div className="presc_image">
      {medicine.Picture && medicine.Picture.data && medicine.Picture.contentType && (
                        <img
                            src={`data:${medicine.Picture.contentType};base64,${arrayBufferToBase64(medicine.Picture.data.data)}`}
                            alt={medicine.Name}
                        />
                    )}
      </div> */}
     
      {/* <Link to={`/medicine/${item.med._id}`} className="presc_name">
        <p>{medicine.Name}</p>
      </Link> */}
      
       <input type="text"  style={{width:'100px', border:"0px"}} value={medicine.Name} readOnly />
      <select
        className="presc_select"
        value={quantity}
        onChange={(e) => handleQuantityChange(e.target.value)}
      >
        {[...Array(20).keys()].map((option) => (
          <option key={option + 1} value={option + 1}>
            {option + 1}
          </option>
        ))}
      </select>
      {/* <p className="Presc_dosage">${item.dosage}</p> */}
      <div>
        <div style={{ cursor: "pointer" }}>
          <button className="presc_del" onClick={handleDeletePrescItem} style={{padding:"5px 10px"}}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescItem;
