import "../Styles/cartScreen.css"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../components/CartContext';
import CartItem from '../components/CartItem';

const PrescInfo = () => {
  const params = new URLSearchParams(window.location.search);
  const prescId = params.get('Id');

  const { cartItems, updateCartItems } = useCart();
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    // Fetch presc items
    axios.post('http://localhost:8000/doctor/getPrescMeds', { id:prescId }, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } })
      .then((response) => {
        console.log(response);
        // updateCartItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  }, []);

  return (
    <div className="cartscreen">
      <div className="cart_left">
        <h2>Prescription Items</h2>
        {/* {cartItems.map((item) => (
          <CartItem key={item._id} item={item} />
        ))} */}
      </div>
      <div className="cart_right">
          <div className="cart_info">
            {/* <p>Subtotal ({cartItems.length}) items</p>
            <p>${totalSum}</p> */}
          </div>
          <div>
          {/* <button onClick={() => window.location.pathname = './checkout'}>Back to Prescriptions</button> */}
        </div>
      </div>
    </div>
  );
}

export default PrescInfo;
