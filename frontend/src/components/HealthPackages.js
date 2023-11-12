
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthPackageSubscriptionPage = () => {
  const [patientHealthPackageData, setPatientHealthPackageData] = useState({});
  const [familyHealthPackageData, setFamilyHealthPackageData] = useState([]);

  const fetchHealthPackageData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/patient/viewSubscriptions", {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      });

      const result = response.data.result;
      // console.log(result);
      // Extract patient health package data
      setPatientHealthPackageData(result.myUser);

      setFamilyHealthPackageData(result.familyMembers);
      console.log(familyHealthPackageData);
    } catch (error) {
      console.error('Error fetching health package data:', error.message);
    }
  };

  return (
    <div>
      <button
        style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={fetchHealthPackageData}>
        View Subscribed HealthPackages
      </button>

      <div>
        <h2>Patient Health Package Data:</h2>
        <p><strong>Patient ID:</strong> {patientHealthPackageData._id}</p>
        <p><strong>Package_Type:</strong> {patientHealthPackageData.packageType}</p>
        <p><strong>Subscription_fees:</strong> {patientHealthPackageData.subsriptionFeesInEGP}</p>
        <p><strong>medicin Discount:</strong> {patientHealthPackageData.medicinDiscountInPercentage}</p>
        <p><strong>family Discount:</strong> {patientHealthPackageData.familyDiscountInPercentage}</p>
        <p><strong>doctor Discount:</strong> {patientHealthPackageData.doctorDiscountInPercentage}</p>
      </div>

      <div>
        <h2>Family Members Health Package Data:</h2>
        {familyHealthPackageData.map((familyMember, index) => (
          <div key={index}>
            <p><strong>Family Member ID:</strong> {familyMember._id}</p>
            <p><strong>Name:</strong> {familyMember.Name}</p>
            <p><strong>Email:</strong> {familyMember.Email}</p>
            <p><strong>Package_Type:</strong> {familyMember.packageType ? familyMember.packageType : 'No sub'}</p>
            <p><strong>Subscription_fees:</strong> {familyMember.subsriptionFeesInEGP ? familyMember.subsriptionFeesInEGP : 'No sub'}</p>
            <p><strong>medicin Discount:</strong> {familyMember.medicinDiscountInPercentage ? familyMember.medicinDiscountInPercentage : 'No sub'}</p>
            <p><strong>family Discount:</strong> {familyMember.familyDiscountInPercentage ? familyMember.familyDiscountInPercentage : 'No sub'}</p>
            <p><strong>doctor Discount:</strong> {familyMember.doctorDiscountInPercentage ? familyMember.doctorDiscountInPercentage : 'No sub'}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthPackageSubscriptionPage;
