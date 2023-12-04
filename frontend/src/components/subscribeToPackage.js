import React, { useState, useEffect } from 'react';
import "../Styles/LoginForm.css";
import PaymentPage from '../components/ChoosePaymentMethod';
import "../Styles/Appointments.css";
import "../Styles/Packages.css";
import axios from 'axios';

const PackagesTab = () => {
  const [packages, setPackages] = useState([]);
  const [regFamily,setRegFamily] = useState([]);
  const [famMemId,setFamMemId] = useState(null);
  const [selectedFam,setSelectedFam] = useState('');
  const [selectedPackage,setSelectedPackage] = useState('');
  const [showPaymentButtons, setShowPaymentButtons] = useState(false);

  useEffect(() => {
    console.log("Hi");
    fetchHealthPackages();
    fetchData();

  }, []);

  const fetchData = async () => {
    console.log(sessionStorage.getItem("token") )
    try {
        const response = await axios.get(`http://localhost:8000/patient/viewFamMem`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        const data = response.data;
          setRegFamily(data.Result.registered)
             console.log(data.Result)
    } catch (error) {
        console.error('Error fetching data:', error);
        alert(error.response.data.message)
    }
};

const handleFamilyChange = (event) => {
    setSelectedFam(event.target.value);
    if(event.target.value !== 'myself')
        setFamMemId(regFamily[(event.target.selectedIndex)-1]._id);
    else
        setFamMemId(null);
};


const choosePayment = () => {
    setShowPaymentButtons(true);
  };

  const fetchHealthPackages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/patient/viewHealthCarePackages',
    { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      const data = response.data;
      console.log(data);

      if (response.status ===200) {
        setPackages(data.Result);
      } else {
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const subscribeToPackage = (packageId) => {
    setSelectedPackage(packageId);
    choosePayment();
  };



  return (
    <div>
                <div>
                <label>Patient:</label>
                <select value={selectedFam} onChange={handleFamilyChange}>
                    <option value='myself'>myslef</option>
                    {regFamily.map((famMem) => (
                        <option key={famMem._id} value={famMem.Name}>
                            {famMem.Name}
                        </option>
                    ))}
                </select>
                <div
                    style={{
                        width: "700px",
                        overflow: "scroll",
                        border: "1px solid #ddd",
                    }}
                >
                </div>
                
            </div>
            {showPaymentButtons && (
        <PaymentPage
        selectedDoctor={null}
        selectedDate={null}
        famMemId={famMemId}
        packageId={selectedPackage}
        />
        )}
      <h1>Health Packages</h1>
      <div id="packageList">
        {packages.length > 0 ? (
          packages.map((packageS) => (
            <div key={packageS.packageType} className="package-item">
              <h2>Package Type: {packageS.packageType}</h2>
              <p>Subscription Fees (EGP): {packageS.subsriptionFeesInEGP}</p>
              <p>Doctor Discount (%): {packageS.doctorDiscountInPercentage}</p>
              <p>Medicine Discount (%): {packageS.medicinDiscountInPercentage}</p>
              <p>Family Discount (%): {packageS.familyDiscountInPercentage}</p>
              <button className={`timeslot ${selectedPackage === packageS._id ? 'selected' : ''}`} onClick={() => subscribeToPackage(packageS._id)}>Subscribe</button>
            </div>
          ))
        ) : (
          <p>No health packages available.</p>
        )}
      </div>
      
    </div>
  );
};

export default PackagesTab;
