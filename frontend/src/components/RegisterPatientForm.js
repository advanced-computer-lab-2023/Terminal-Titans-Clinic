// import React from "react";
import React, { useState, useEffect } from 'react';
import "../Styles/LoginForm.css";
import validator from 'validator'
import axios from 'axios';
// import * as fs from 'fs';
// import { type } from "os";
// import { Binary } from "mongodb";

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobile, setMobileNumber] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [first, setEmergencyFirtName] = useState('');
  const [last, setEmergencyLastName] = useState('');
  const [gender, setGender] = useState('');
  const [history, setHistory] = useState('');

  const [errorMessagePass, setErrorMessagePass] = useState('')
  const [errorMessageEmail, setErrorMessageEmail] = useState('')


  const [file, setFile] = useState(null);
  const [binaryData, setBinaryData] = useState(null);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryString = e.target.result;
        setBinaryData(binaryString);
      };
      reader.readAsBinaryString(file);
      setHistory(file);
    }
  }, [file]);

  const validatePass = (value) => {
    setPassword(value);
    if (value !== '' && validator.isStrongPassword(value, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 0
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
  const handleRegister = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // const base64 = await fs.readFile(history.uri, 'base64')
    // const buffer = Buffer.from(base64, 'base64')
    // Create a JSON object with the username and password
    console.log(history.name);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('first', first);
    formData.append('last', last);
    formData.append('gender', gender)
    formData.append('emergencyNumber', emergencyNumber);
    formData.append('history', history);
    // const data = {
    //   "username":username,
    //   "password":password,
    //   "dateOfBirth":dateOfBirth,
    //   "name":name,
    //   "email":email,
    //   "mobile":mobile,
    //   "first":first,
    //   "last":last,
    //   "gender":gender,
    //   "emergencyNumber":emergencyNumber,
    //   "history": history,
    // };

    // Make a POST request to your backend register route
    axios.post('http://localhost:8000/security/patient/', formData).then((response) => {
      console.log(response.data);
      if (response.data.success) {
        sessionStorage.setItem('token', response.data.token);
        // go to page patient
      }
      else {
        alert(response.data.message);

      }
    })
      .catch(error => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }

  //   await fetch('http://localhost:8000/security/patient/', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'content-type': history.type,
  //       'content-length': `${history.size}`,
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => {
  //       // Check the status code
  //       console.log(response);

  //       return response.json();

  //     })
  //     .then((data) => {
  //       if (data.status !== 200) {
  //         alert(data.message)
  //       }
  //       // Handle the response data
  //       console.log('Response data:', data);
  //     })
  //     .catch((error) => {
  //       // Handle network errors or other issues
  //       console.error('Error:', error);
  //     });
  // };

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
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="Date"
            value={dateOfBirth}
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
          <label htmlFor="history">Medical History:</label>

          {/* <input type="file" name="History" accept=".jpg , .png, .pdf, .jpeg" onChange={handleFileInputChange} />
          {history && (
            <p>
              <strong>{history.name}</strong> ({history.size} bytes)
            </p>
          )}
          {history && (
            <button type="button" onClick={handleRemoveFile}>
              X
            </button>
          )} */}
          <input type="file" onChange={handleFileChange} />



          <button type="submit" onClick={handleRegister}>Register</button>

        </form>
      </div>

    </div>
  );
}

export default RegistrationForm;
