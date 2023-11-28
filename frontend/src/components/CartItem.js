

// import { Link } from "react-router-dom";
// const CartItem = () =>{
//     return(
//         <div className="cartitem">
//             <div className="cart_image">
//                 <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fmedication&psig=AOvVaw1OQVHNftXTwBLMRy6QIoRT&ust=1699424613973000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJC8wpWgsYIDFQAAAAAdAAAAABAE" alt="med name"/>

//             </div>
//             <Link to={`/medicine/${1111}`} className="cart_name">
//                 <p>Med1</p>

//             </Link>
//             <p className="Cart_price">$1000</p>
//             <select className="cart_select">
//                 <option value="1">1</option>
//                 <option value="2">2</option>
//                 <option value="3">3</option>
//                 <option value="4">4</option>
//             </select>
//             <button className="cart_del">
//                 <i className="fas fa-trash"></i>
//             </button>
//         </div>
           
//     )
// } 

// export default CartItem;
// CartItem.js
import "../Styles/CartItem.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams } from 'react-router-dom';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [medicine, setMedicine] = useState(null);

  const location = useLocation();
  const { medicineId } = useParams();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('http://localhost:8000/Patient/getAllMedicine/',{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}});
        const medicines = response.data.meds;

        const matchedMedicine = medicines.find((med) => med._id === item.medicineId);

        if (matchedMedicine) {
          setMedicine(matchedMedicine);
        }
      } catch (error) {
        console.error('Error fetching medicines data:', error);
      }
    };

    fetchMedicines();
  }, [item.medicineId]);

  const handleQuantityChange = async (newQuantity) => {
    try {
      await axios.put(`http://localhost:8000/Patient/updateCartItem/${item._id}`, { quantity: newQuantity },{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}});
      setQuantity(newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeleteCartItem = async () => {
    try {
      await axios.delete(`http://localhost:8000/Patient/deleteCartItem/${item._id}`,{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}});
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  if (!medicine) {
    return <div>Loading or no data available for the medicine.</div>;
  }

  return (
    <div className="cartitem">
      <div className="cart_image">
      {medicine.Picture && medicine.Picture.data && medicine.Picture.contentType && (
                        <img
                            src={`data:${medicine.Picture.contentType};base64,${arrayBufferToBase64(medicine.Picture.data.data)}`}
                            alt={medicine.Name}
                        />
                    )}
      </div>
      <Link to={`/medicine/${item.medicineId}`} className="cart_name">
        <p>{medicine.Name}</p>
      </Link>
      <p className="Cart_price">${medicine.Price}</p>
      <select
  className="cart_select"
  value={quantity}
  onChange={(e) => handleQuantityChange(e.target.value)}
>
  {[...Array(medicine.Quantity).keys()].map((option) => (
    <option key={option + 1} value={option + 1}>
      {option + 1}
    </option>
  ))}
</select>
      <button className="cart_del" onClick={handleDeleteCartItem}>
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default CartItem;
