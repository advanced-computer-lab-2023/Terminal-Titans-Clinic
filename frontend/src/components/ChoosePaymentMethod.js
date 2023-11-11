import "../Styles/LoginForm.css";
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const PaymentPage = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (paymentMethod) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/Patient/payForAppointment/`,
        {
          user: {
            _id: "654a7b01d35ec49ccebf9522"
          },
          familyMember: {
            _id: "6525ca2d0c32bc7c0e726d84"
          },
          doctor: {
            _id: "652323f2050647d6c71d8758"
          },
          date: "2031-10-10T00:00:00.000+00:00"
        },
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem("token")
          },
          params: {
            userType: "patient",
            paymentType: paymentMethod
          },
        }
      );
      if (response.status === 200) {
        if(response.data.url){
          const url = response.data.url;
          window.location = url;
        }else{
          setErrorMessage("Success");
        }
      } else {
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

export default PaymentPage;
