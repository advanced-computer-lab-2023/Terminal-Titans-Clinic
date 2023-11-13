import "../Styles/LoginForm.css";
import axios from 'axios';
import React, { useState, useEffect } from 'react';



const PaymentPage = ({ selectedDoctor, selectedDate, famMemId, packageId }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (paymentMethod) => {
    try {
      if(packageId===null){
        const response = await axios.post(
          `http://localhost:8000/Patient/payForAppointment/`,
          {
            familyMember: {
              _id: famMemId
            },
            doctor: {
              _id: selectedDoctor
            },
            date: selectedDate
          },
          {
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem("token") 
            },
            params: {
              userType: famMemId==null?"patient":"familyMember",
              paymentType: paymentMethod
            },
          }
        );
        if (response.status === 200) {
          if(paymentMethod==="card"){
            const url = response.data.url;
            window.location = url;
          }else{
            setErrorMessage("Success");
            alert('Successfull payment');
            bookAppointment();
          }
        } else {
          setErrorMessage(response.data.message);
          alert('Unsuccessfull payment');
        }
      }
      else{
        const response = await axios.post(
          `http://localhost:8000/Patient/subscribeForPackage/`,
          {
            familyMember: {
              _id: famMemId
            },
            healthPackage: {
              _id: packageId
            }
          },
          {
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem("token") 
            },
            params: {
              userType: famMemId==null?"patient":"familyMember",
              paymentType: paymentMethod
            },
          }
        );
        if (response.status === 200) {
          if(paymentMethod==="card"){
            const url = response.data.url;
            window.location = url;
          }else{
            setErrorMessage("Success");
            alert('Successfull payment');
            subscribePackage();
          }
        } else {
          setErrorMessage(response.data.message);
          alert('Unsuccessfull payment');
        }
      }
    } catch (error) {
      console.error('Error in payment:', error.message);
      alert('Unsuccessfull payment');
      setErrorMessage(error.message);
    }
  };

  const bookAppointment = async () => {
    const response = await axios.post(
        `http://localhost:8000/patient/bookAppointment`,
        { dId: selectedDoctor, date: selectedDate, famId: famMemId},
        { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );

    
}

  const subscribePackage = async () => {
    if(famMemId===null){
      const response = await axios.post(
          `http://localhost:8000/patient/subscribeHealthPackage/:packageId'`,
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") },
          params: {
            packageId: packageId
          }, }
      );
    }else{
      const response = await axios.post(
          `http://localhost:8000/patient/subscribeHealthPackageforFamily`,
          { packageId: packageId, familyMemberId: famMemId},
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
      );
    }


}

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
