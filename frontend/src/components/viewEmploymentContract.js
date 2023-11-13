 import React, { useState, useEffect } from 'react';
 import axios from 'axios';

const ViewEmploymentContract = () => {
    const [contractText, setContractText] = useState('');
    const [decision, setDecision] = useState('');
  
    // Other necessary state variables can be added based on your requirements
    // ...
  
    const fetchContract = async () => {
        const response = await axios.get(
          `http://localhost:8000/doctor/viewContract`,
          null,
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        if (response.status === 200) {
          const contractText = response.data.message;
          console.log(contractText);
          setContractText(contractText);
        }
      }

          const accept = async () => {
        const response = await axios.post(
          `http://localhost:8000/doctor/acceptContract`,
          null,
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        if (response.status === 200) {
          const contractText = response.data.message;
          console.log(contractText);
          setContractText(contractText);
        }
      }


  
    return (
      <div>
        <p>{contractText}</p>
  
        {/* Buttons for Accept and Reject */}
        <button onClick={() => accept()}>Accept</button>
       
  
        {/* Display the decision */}
        {decision && <p>You have chosen to {decision} the contract.</p>}
      </div>
    );
   };
  
  export default ViewEmploymentContract;