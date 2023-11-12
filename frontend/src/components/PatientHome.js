
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientHome = () => {
  const [wltAmnt, setWltAmnt] = useState([]);
 // const [familyHealthPackageData, setFamilyHealthPackageData] = useState([]);

  const fetchwltAmnt = async () => {
    try {
      const response = await axios.get("http://localhost:8000/patient/getWalletAmount", {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      });

      const result = response.data.Amount;
      console.log(result);
      setWltAmnt(result);
      

    } catch (error) {
      console.error('Error fetching wallet data:', error.message);
    }
  };

  return (
    <div>
      <button
        style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={fetchwltAmnt}>
        View Amount in my Wallet
      </button>

      <div>
        <h3>Wallet:</h3>
        {/* <p><strong>Patient ID:</strong> {patientHealthPackageData._id}</p> */}
        <p><strong>Amount:</strong> {wltAmnt}EGP</p>
        </div>

      {/* <div>
        <h3>FamilyMembers HealthPackage Data:</h3>
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
      </div> */}
    </div>
  );
};

export default PatientHome;
