//  import { Button } from "bootstrap";
import Button from 'react-bootstrap/Button';
import "./Meds.css";
import { useNavigate, createSearchParams } from "react-router-dom";

// export default Meds;
// Utility function to convert ArrayBuffer to Base64
import React from 'react';
import { Link } from 'react-router-dom';
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

// Your component code


const Meds = ({ medicines }) => {
    const navigate = useNavigate();
    const navMed = (id) => {
        navigate('/medicinepharm', {
            state: {
              medicineId: id
            }
        });
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
                      {/* <Link to={`/medicinepharm/${medicine._id}`}> */}
                        <Button variant='outline-dark' style={{width:'100%'}} onClick={()=>navMed(medicine._id)}>View</Button>
                      {/* </Link>  */}
                  </div>
              </div>
          ))}
      </div>
  );
};

export default Meds;

// import React from 'react';
// import { Link } from 'react-router-dom';


// const Meds = ({ medicines }) => {
//     return (
//         <div className="Medcines">
//             {medicines.map((medicine) => (
//                 <div key={medicine.id} className="medicine">
//                     {medicine.Picture && (
//                         <img
//                             src={medicine.Picture.url} // Use the URL field
//                             alt={medicine.Name}
//                         />
//                     )}

//                     <div className="meds_info">
//                         <p className="info_name">{medicine.Name}</p>
//                         <p className="infooo">{medicine.MedicalUse.join(' ')}</p>
//                         <p className="price">${medicine.Price}</p>
//                         <Link to={`/medicine/${medicine.Name}`} className="info_buttom">
//                             View
//                         </Link>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };



// export default Meds;


