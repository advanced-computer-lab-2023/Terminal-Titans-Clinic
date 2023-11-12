// import React from "react";
import "../Styles/LoginForm.css";
import React, { useState } from 'react';
import validator from 'validator'

//var x=1;


function AddRegFamMem() {

  const [email, setEmail] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('')
  const [phoneNum, setPhoneNum] = useState('');
  const [relation, setRelation] = useState('Spouse');

  
  const validateEmail = (value) => {
    setEmail(value);
    if (validator.isEmail(value)) {
      setErrorMessageEmail('')
    } else {

      setErrorMessageEmail('Enter a valid email')
    }
  }
  const registerByEmail = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { email ,relation};
    console.log(data)
        if (validator.isEmail(email)) {
        fetch('http://localhost:8000/patient/addRegFamilyMembyMail', {
            method: 'POST',
            headers:{  'Content-Type': 'application/json',Authorization: 'Bearer ' + sessionStorage.getItem("token") },
            body: JSON.stringify(data),
          }).then((response) => response.json()).then(data => {
            if (data.success ) {
             // alert("Password Changed Successfully")
            }
            else{
              alert(data.message)
            }          
          })
          .catch((error) => {
            
            console.error('Error:', error);
            alert(error.response.data.message)
    
          });
      // Make a POST request to your backend register route
     
    }
  };
  const registerByPhoneNum = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { phoneNum,relation};
    // Make a POST request to your backend register route
    fetch('http://localhost:8000/patient/addRegFamilyMembyNum', {
        method: 'POST',
        headers:{  'Content-Type': 'application/json',Authorization: 'Bearer ' + sessionStorage.getItem("token") },
        body: JSON.stringify(data),
      }).then((response) => response.json()).then(data => {
        if (data.success ) {
         // alert("Password Changed Successfully")
        }
        else{
          alert(data.message)
        }          
      })
      .catch((error) => {
        
        console.error('Error:', error);
        alert(error.response.data.message)

      });
  };
  const handleRelationChange = (event) => {
    setRelation(event.target.value);
};

  
  
    return (

      <div >

        <div id="login-form">
          {/* <h1>Sign up</h1> */}
          <form>
            <h5>Enter the email of your family member</h5>
            <br></br>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}></input> <br />
            {errorMessageEmail === '' ? null :
              <span style={{
                color: 'red',
              }}>{errorMessageEmail}</span>}
            <select value={relation} onChange={handleRelationChange}>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
            </select>

            <button type="submit" onClick={registerByEmail}>Register</button>

          </form>
        </div>

<br></br>
        <div id="login-form">
          {/* <h1>Sign up</h1> */}
          <form>
            <h5>Enter the phone number of your family member</h5>
            <br></br>
            <label htmlFor="phoneNum">phone NumBER:</label>
            <input
                type="text"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}></input> <br />
            
            <select value={relation} onChange={handleRelationChange}>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
            </select>

            <button type="submit" onClick={registerByPhoneNum}>Register</button>

          </form>
        </div>

      </div>
    );
  }
 
export default AddRegFamMem;
