import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import "../Styles/LoginForm.css";
import axios from 'axios';

const ConfirmPaymentPage = () => {
    debugger
    console.log("HIIII");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentType = queryParams.get('paymentType');
  const famMemId = queryParams.get('fId');
  const selectedDate = queryParams.get('sDate');
  const selectedDoctor = queryParams.get('sDoc');
  const packageId = queryParams.get('sP');

  const handleConfirmation = async () => {
    try {
      // Call the appropriate function based on paymentType
      if (paymentType === 'appointment') {
        await bookAppointment();
        // Redirect to success URL for bookPayment
        window.location =`http://localhost:3000/Health-Plus/${paymentType === 'appointment'?'bookAppointments':'packageSubscribtion'}`;
      } else if (paymentType === 'package') {
        await subscribePackage();
        // Redirect to success URL for subscribePackage
        window.location =`http://localhost:3000/Health-Plus/${paymentType === 'appointment'?'bookAppointments':'packageSubscribtion'}`;
      }
    } catch (error) {
      // Handle errors and redirect to the failure URL
      console.error('Payment failed:', error);
      window.location =`http://localhost:3000/Health-Plus/${paymentType === 'appointment'?'bookAppointments':'packageSubscribtion'}`;
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
          `http://localhost:8000/patient/subscribeHealthPackage`,
          { packageId: packageId},
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") }
           }
      );
    }else{
      const response = await axios.post(
          `http://localhost:8000/patient/subscribeHealthPackageforFamily`,
          { packageId: packageId, familyMemberId: famMemId},
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
      );
    }


}

  return (
    <div>
      <h1>Confirm Payment</h1>
      <button onClick={handleConfirmation}>Confirm Payment</button>
    </div>
  );
};

export default ConfirmPaymentPage;
