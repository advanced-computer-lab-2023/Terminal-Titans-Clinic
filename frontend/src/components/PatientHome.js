
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
  function handlePackagesClick() {
    window.location.pathname = '/Health-Plus/healthPackages';
  }
  function handleAppointmentsClick() {
    window.location.pathname = '/Health-Plus/bookAppointments';
  }

  function handleHealthRecordsClick() {
    window.location.pathname = '/Health-Plus/viewHealthRecords';
  }
  function handleChangePasswordClick() {
    window.location.pathname = '/Health-Plus/changePassword';
  }
  function handleAddFamilyMemberClick() {
    window.location.pathname = '/Health-Plus/addRegFamilymember';
  }
  function handleForgotPassClick() {
    window.location.pathname = '/Health-Plus/forgotPassword';
  }
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

        <button
        style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={ handlePackagesClick}>
        View My Health Packages
      </button>

      <button
        style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={ handleChangePasswordClick}>
        Change Password
      </button>
      <button
        style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={handleAddFamilyMemberClick}>
        Link family Member's account
      </button>

      <button
        style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={ handleAppointmentsClick}>
        View available slots and Book
      </button>
      <button
      style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
      onClick={() => {
        window.location.pathname = '/Health-Plus/viewAppointments';
      }}>
     View my appointments
        </button>
      <button
        style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={ handleHealthRecordsClick}>
        Health Records
      </button>

      <button
        style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={ handleForgotPassClick}>
        forgot password
      </button>
      <button
      style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
      onClick={() => {
        window.location.pathname = '/Health-Plus/packageSubscribtion';
      }}>
      Subscribe to a health package
        </button>



      
    </div>
  );
};

export default PatientHome;
