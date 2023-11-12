import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthPackageSubscriptionPage = () => {
  const [patientHealthPackageData, setPatientHealthPackageData] = useState({});
  const [familyHealthPackageData, setFamilyHealthPackageData] = useState([]);

  const [patientHealthPackageStatus, setPatientHealthPackageStatus] = useState({});
  const [familyHealthPackageStatus, setfamilyHealthPackageStatus] = useState([]);

  const [patientHealthPackageCancel, setPatientHealthPackageCancel] = useState({});
  const [familyHealthPackageCancel, setfamilyHealthPackageCancel] = useState([]);

  const fetchHealthPackageData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/patient/viewSubscriptions", {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      });

      const result = response.data.result;
      setPatientHealthPackageData(result.myUser);
      setFamilyHealthPackageData(result.familyMembers);

    } catch (error) {
      console.error('Error fetching health package data:', error.message);
    }
  };

  const fetchHealthPackageStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8000/patient/viewSubscriptionStatus", {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      });

      const result = response.data.result;
      setPatientHealthPackageStatus(result.myUser.status);
      setfamilyHealthPackageStatus(result.familyMembers);

    } catch (error) {
      console.error('Error fetching health package status:', error.message);
    }
  };

  const cancelHeathPackage = async () => {
    try {
      const response = await axios({
        method: 'put',
        url: 'http://localhost:8000/patient/cancelSub',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      })

      const result = response.data.result;
      setPatientHealthPackageCancel(result.myUser);
      setfamilyHealthPackageCancel(result.familyMembers);

    } catch (error) {
      console.error('Error cancelling health package:', error.message);
    }
  };

  return (
    <div>
      <button
        style={{ background: 'green', color: 'white', padding: '8px', cursor: 'pointer' }}
        onClick={fetchHealthPackageData}>
        View Subscribed HealthPackages
      </button>
    {/* subscribed health package front */}
      <div style={{ marginTop: '20px' }}>
        <h4>Patient HealthPackage Data:</h4>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Package Type</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Subscription Fees</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Medicine Discount</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Family Discount</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Doctor Discount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.packageType}</td>
              <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.subsriptionFeesInEGP} EGP</td>
              <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.medicinDiscountInPercentage}%</td>
              <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.familyDiscountInPercentage}%</td>
              <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.doctorDiscountInPercentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>
        {/*status patient front  */}
      <div style={{ marginTop: '20px' }}>
        <h4>FamilyMembers HealthPackage Data:</h4>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Email</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Package Type</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Subscription Fees</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Medicine Discount</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Family Discount</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Doctor Discount</th>
            </tr>
          </thead>
          <tbody>
            {familyHealthPackageData.map((familyMember, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.Name}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.Email}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.packageType || 'No sub'}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.subsriptionFeesInEGP || 'No sub'} EGP</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.medicinDiscountInPercentage || 'No sub'}%</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.familyDiscountInPercentage || 'No sub'}%</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.doctorDiscountInPercentage || 'No sub'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {/* family members status front */}
      <div style={{ marginTop: '20px' }}>
        <button
          style={{ background: 'green', color: 'white', padding: '8px', cursor: 'pointer' }}
          onClick={fetchHealthPackageStatus}>
          View HealthPackages Status
        </button>

        <div style={{ marginTop: '20px' }}>
          <h4>Patient HealthPackage Status:</h4>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Status</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Renewal Date</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>End Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageStatus.status}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageStatus.renewalDate || 'Nothing'}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageStatus.endDate || 'Nothing'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>FamilyMembers HealthPackage Status:</h4>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Relation</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Status</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Renewal Date</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>End Date</th>
              </tr>
            </thead>
            <tbody>
              {familyHealthPackageStatus.map((familyMembers, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.Relation}</td>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.status}</td>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.renewalDate || 'Nothing'}</td>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.endDate || 'Nothing'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    {/* cancellation front */}
      <div style={{ marginTop: '20px' }}>
        <button
          style={{ background: 'red', color: 'white', padding: '8px', cursor: 'pointer' }}
          onClick={cancelHeathPackage}>
          Cancel Subscription
        </button>

        <div style={{ marginTop: '20px' }}>
          <h4>Patient HealthPackage:</h4>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Status</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Renewal Date</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>End Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageCancel.status}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageCancel.renewalDate || 'Nothing'}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageCancel.endDate || 'Nothing'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>FamilyMembers HealthPackage:</h4>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Relation</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Status</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Renewal Date</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>End Date</th>
              </tr>
            </thead>
            <tbody>
              {familyHealthPackageCancel.map((familyMembers, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.Relation}</td>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.status}</td>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.renewalDate || 'Nothing'}</td>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.endDate || 'Nothing'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthPackageSubscriptionPage;
