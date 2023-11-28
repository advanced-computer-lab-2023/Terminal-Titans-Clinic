import "../Styles/LoginForm.css";
import axios from 'axios';
import { finalAddress } from "./addAddress";
import React, { useState, useEffect } from 'react';
let Method='COD';
const PaymentPage = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (paymentMethod) => {
    console.log(finalAddress);
    Method=paymentMethod;
    try {
      const response = await axios.post(
        `http://localhost:8000/Patient/payment/`,
        {
          paymentMethod: paymentMethod,
          address: finalAddress,
          
        },
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem("token")
          },
          
        }
      );
      console.log(response);
      console.log('l')
      if (response.status === 200) {
        if(response.data.url){
          const url = response.data.url;
          window.location = url;
        }else{
             window.location ='/patient'
          setErrorMessage("Success");
        }
      } else {
        alert(response.data)
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error in payment:', error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
  }, []);

  return (
    <div>
      <h1>Select Payment Method</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={() => handlePayment('card')}>Pay with Credit Card</button>
      <button onClick={() => handlePayment('wallet')}>Pay with Wallet</button>
      <button onClick={() => handlePayment('COD')}>Cash on Delivery</button>
    </div>
  );
};
export {Method}
export default PaymentPage;
