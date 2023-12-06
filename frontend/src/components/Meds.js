import "../Styles/Meds.css";
import React from 'react';
import { Link } from 'react-router-dom';

const Meds = ({ medicines }) => {
    if (!medicines || !Array.isArray(medicines)) {
        return null; // or handle this case in a way that makes sense for your application
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
            <Link to={`/medicine?medicineId=${medicine._id}`} className="info_buttom">
              View
            </Link>
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

