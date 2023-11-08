// import React from "react";
import "../Styles/LoginForm.css";
import validator from 'validator'
import React, { useState } from 'react';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDateOfBirth] = useState('');
  const [mobile, setMobileNumber] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [first, setEmergencyFirtName] = useState('');
  const [last, setEmergencyLastName] = useState('');
  const [gender, setGender] = useState('');

  const [errorMessagePass, setErrorMessagePass] = useState('') 
  const [errorMessageEmail, setErrorMessageEmail] = useState('') 

    const validatePass = (value) => { 
      setPassword(value);
        if (value!=='' && validator.isStrongPassword(value, { 
            minLength: 8, minLowercase: 1, 
            minUppercase: 1, minNumbers: 1,minSymbols:0
        })) { 
          setErrorMessagePass('Is Strong Password') 
        } else { 

          setErrorMessagePass('Password has to be 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number ') 
        } 
    } 
    const validateEmail = (value) => { 
      setEmail(value);
        if (validator.isEmail(value)) { 
          setErrorMessageEmail('') 
        } else { 

          setErrorMessageEmail('Enter a valid email') 
        } 
    } 
  const handleRegister = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { username, password ,dob,name,email,mobile,first,last,gender,emergencyNumber };

    // Make a POST request to your backend register route
    fetch('http://localhost:8000/security/patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Check the status code
        console.log(response);
        
          return response.json();
        
      })
      .then((data) => {
        if(data.status !== 200){
          alert(data.message)
        }
        // Handle the response data
        console.log('Response data:', data);
      })
      .catch((error) => {
        // Handle network errors or other issues
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <div id="login-form">
       <h1>Sign up</h1>
       <form>
       <label htmlFor="name">name:</label>
         <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
         />
         <label htmlFor="username">Username:</label>
         <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
         />
         <label htmlFor="password">Password:</label>
         <input
        type="password"
        value={password}
        onChange={(e) => validatePass(e.target.value)}></input> <br /> 
                {errorMessagePass === '' ? null : 
                    <span style={{ 
                        color: 'red', 
                    }}>{errorMessagePass}</span>} 
          <br />
      <label htmlFor="email">Email:</label> 
      <input
        type="text"
        value={email}
        onChange={(e) => validateEmail(e.target.value)}></input> <br /> 
                {errorMessageEmail === '' ? null : 
                    <span style={{ 
                        color: 'red', 
                    }}>{errorMessageEmail}</span>} 
      <label htmlFor="dob">Date of Birth:</label>   
      <input
        type="Date"
        value={dob}
        onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <label htmlFor="gender">Gender</label>
        <input
        type="text"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        />
        <label htmlFor="mobile">Mobile Number:</label>
        <input
        type="text"
        value={mobile}
        onChange={(e) => setMobileNumber(e.target.value)}
        />
        <label htmlFor="emergencyNumber">Emergency Number:</label>
        <input
        type="text"
        value={emergencyNumber}
        onChange={(e) => setEmergencyNumber(e.target.value)}
        />
        <label htmlFor="first">Emergency First Name:</label>
        <input
        type="text"
        value={first}
        onChange={(e) => setEmergencyFirtName(e.target.value)}
        />
        <label htmlFor="last">Emergency Last Name:</label>
        <input
        type="text"
        value={last}
        onChange={(e) => setEmergencyLastName(e.target.value)}
        />
        

<button  type="submit" onClick={handleRegister}>Register</button>

       </form>
     </div>

    </div>
  );
}

export default RegistrationForm;
