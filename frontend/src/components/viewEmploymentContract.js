 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
import { set } from 'lodash';
import Button from 'react-bootstrap/Button';


const ViewEmploymentContract = () => {
    const [salary, setSalary] = useState('');
    const [decision, setDecision] = useState('');
    const [name, setName] = useState('');
  
    // Other necessary state variables can be added based on your requirements
    // ...
  
    const fetchContract = async () => {
        const response = await axios.get(
          `http://localhost:8000/doctor/viewContract`,
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        if (response.status === 200) {
          const salary = response.data.result.salary;
          setName(response.data.result.name);

          console.log(response.data);
         setSalary(salary);
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
          
          window.location='/Health-Plus/doctorHome'
         // setContractText(contractText);
        }
      }


  
    return (
      
        <div style={{height:'80vh'}}>
            <div   style={{ width: "100% ",backgroundColor:'black' }}>
           
        <h1 style={{color:'white', textAlign:'center'}}>Employment Contract</h1>
        </div>
      
                
                    
                    <div className="form-group" >
                    <div>
       
      
        <h3>This Employment Agreement ("Agreement") is entered into between Terminal Clinic ("Employer") and {name} ("Employee") effective upon acceptance of this contract, and shall continue until terminated by either party with a written notice period of 30 days.</h3>
         
          
          <h2>Terms of Employment:</h2>
          <h5>The Employer agrees to engage the services of {name} as an employee.</h5>
          <h5>The Employee shall provide medical services at Terminal Clinic.</h5>
          <h2>Compensation:</h2>
          <h5>The Employee shall be compensated at a rate of ${salary} per appointment.</h5>
          <h5>The Clinic shall apply a markup of 10% for each appointment.</h5>
          <h2>Termination:</h2>
          <h5>Either party may terminate this Agreement by providing a written notice of 30 days.</h5>
          <h2>Acceptance:</h2>
          <h5>By clicking the Accept button below, you agree to the terms of this contract.</h5>
        {/* Buttons for Accept and Reject */}
        <div style={{textAlign:'right', paddingRight:'5px'}}>
        <Button variant="dark" style={{ width: '30%' }} onClick={() => accept()}>
          Accept Contract
        </Button>
        </div>
      
      </div>
                       
                    </div>

                
        </div>
     
    );
   };
  
  export default ViewEmploymentContract;