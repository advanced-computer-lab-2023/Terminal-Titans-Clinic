
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthPackageSubscriptionPage = () => {
  const [healthPackageData, setHealthPackageData] = useState("");

  const fetchHealthPackageData = async () => {
    console.log(sessionStorage.getItem("token"));
      const response = await axios.get("http://localhost:8000/patient/viewSubscriptions", {
        headers: {
          Authorization: 'Bearer' + sessionStorage.getItem('token')         
        }
      });

      setHealthPackageData(response.data);
   
  }
  useEffect(()=>{
    fetchHealthPackageData()
  },[]);

  return (
    <div>
      <button
        style={{ background: 'blue', color: 'white', padding: '10px', cursor: 'pointer' }}
        onClick={fetchHealthPackageData}>
        View
      </button> 
      {healthPackageData}

    </div>
  );
};

export default HealthPackageSubscriptionPage;
