
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorHome = () => {
  const [wltAmnt, setWltAmnt] = useState([]);
 // const [familyHealthPackageData, setFamilyHealthPackageData] = useState([]);

  const fetchwltAmnt = async () => {    
    try {
      const response = await axios.get("http://localhost:8000/doctor/getWalletAmount", {
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
        {/* <p><strong>Doctor ID:</strong> {DoctorHealthPackageData._id}</p> */}
        <p><strong>Amount:</strong> {wltAmnt}EGP</p>
        </div>

      <button style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={() => window.location.pathname = '/Health-Plus/docViewAppointments'}>
        View Appointments
      </button>
      <button style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={() => window.location.pathname = '/Health-Plus/viewMyPatientHealthRecords'}>
        View Patient's Health Records
      </button>
      <button style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={() => window.location.pathname = '/Health-Plus/changePassword'}>
        Change Password
      </button>
      <button style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={() => window.location.pathname = '/Health-Plus/forgotPassword'}>
        Forgot Password
      </button>
    </div>
  );
};

export default DoctorHome;
