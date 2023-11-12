
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

      // Extract patient health package data
      setPatientHealthPackageData({
        patientId: result.myUser._id,
        Package_Type: result.myUser.packageType,
        Subscription_fees: result.myUser.subsriptionFeesInEGP,
        // Add more fields as needed
      });

      // Extract family members health package data
      const familyMembersData = result.familyMembers.map((member) => ({
        patientId: member.PatientId,
        name: member.Name,
        email: member.Email,
        // Add more fields as needed
      }));
      setFamilyHealthPackageData(familyMembersData);
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
        <p><strong>Patient ID:</strong> {patientHealthPackageData.patientId}</p>
        <p><strong>Package_Type:</strong> {patientHealthPackageData.Package_Type}</p>
        <p><strong>Subscription_fees:</strong> {patientHealthPackageData.Subscription_fees}</p>
        {/* Add more fields as needed */}
      </div>

      <div>
        <h2>Family Members Health Package Data:</h2>
        {familyHealthPackageData.map((familyMember, index) => (
          <div key={index}>
            <p><strong>Family Member ID:</strong> {familyMember.patientId}</p>
            <p><strong>Name:</strong> {familyMember.name}</p>
            <p><strong>Email:</strong> {familyMember.email}</p>
            {/* Add more fields as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthPackageSubscriptionPage;
