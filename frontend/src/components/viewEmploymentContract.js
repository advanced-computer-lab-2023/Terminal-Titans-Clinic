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
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        if (response.status === 200) {
          const contractText = response.data.message;
          console.log(contractText);
          const paragraphs = contractText.split('\n').map((paragraph, index) => (
            <React.Fragment key={index}>
              {paragraph}
              <br />
            </React.Fragment>
          ));
          setContractText(paragraphs);
        }
      }
      useEffect(() => {
        fetchContract();
    }, []);

          const accept = async () => {
        const response = await axios.post(
          `http://localhost:8000/doctor/acceptContract`,
          null,
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        if (response.status === 200) {
          const contractText = response.data.message;
          console.log(contractText);
          window.location='/Health-Plus/doctorHome'
         // setContractText(contractText);
        }
      }


  
    return (
      <div>
        <h2>{contractText}</h2>
  
        {/* Buttons for Accept and Reject */}
        <button onClick={() => accept()}>Accept</button>
       
  
        {/* Display the decision */}
        {decision && <p>You have chosen to {decision} the contract.</p>}
      </div>
    );
   };
  
  export default ViewEmploymentContract;