// import React from "react";
import "../Styles/LoginForm.css";
import validator from 'validator'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [education, setEducation] = useState('');
  const [iD, setID] = useState('');
  const [degree, setDegree] = useState('');
  const [license, setLicense] = useState('');
  const [speciality, setSpeciality] = useState('');

  const [file1, setFile1] = useState(null);
  const [binaryData1, setBinaryData1] = useState(null);

  const [file2, setFile2] = useState(null);
  const [binaryData2, setBinaryData2] = useState(null);

  const [file3, setFile3] = useState(null);
  const [binaryData3, setBinaryData3] = useState(null);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleFile3Change = (e) => {
    setFile3(e.target.files[0]);
  };

  useEffect(() => {
    if (file1) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryString = e.target.result;
        setBinaryData1(binaryString);
      };
      reader.readAsBinaryString(file1);
      setID(file1);
    }
  }, [file1]);

  useEffect(() => {
    if (file2) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryString = e.target.result;
        setBinaryData2(binaryString);
      };
      reader.readAsBinaryString(file2);
      setDegree(file2);
    }
  }, [file2]);

  useEffect(() => {
    if (file3) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryString = e.target.result;
        setBinaryData3(binaryString);
      };
      reader.readAsBinaryString(file3);
      setLicense(file3);
    }
  }, [file3]);


  const [errorMessagePass, setErrorMessagePass] = useState('')
  const [errorMessageEmail, setErrorMessageEmail] = useState('')



  // const specialityOptions = [
  //   { value: 'pediatrician' , label: 'pediatrician' },
  //   { value: 'cardiologist', label: 'cardiologist'},
  //   { value: 'neurologist',   label: 'neurologist'   },
  //   { value: 'dermatologist' , label: 'dermatologist' },
  // ];

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

  const handleSpecialityChange = (event) => {
    console.log(`Option selected:`, event.target.value);
    const selectedValue = event.target.value;
    setSpeciality(selectedValue);
  };


  const handleRegister = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData();
    // Create a JSON object with the username and password
    // const data = { username, password ,name,email,dateOfBirth,hourlyRate,affiliation,education,speciality,iD,degree,license };
    formData.append('username', username);
    formData.append('password', password);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('hourlyRate', hourlyRate);
    formData.append('affiliation', affiliation);
    formData.append('education', education);
    formData.append('iD', iD)
    formData.append('degree', degree);
    formData.append('license', license);
    formData.append('speciality', speciality);
    // Make a POST request to your backend register route
    //   fetch('http://localhost:8000/security/doctor',FormData, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   })
    //     .then((response) => {
    //       // Check the status code
    //       console.log(response);

    //         return response.json();

    //     })
    //     .then((data) => {
    //       if(data.status !== 200){
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
    axios.post('http://localhost:8000/security/doctor/', formData)
      .catch(error => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }
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
          <label htmlFor="hourlyRate">Hourly Rate</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
          <label htmlFor="affiliation">Affiliation (hospital) :</label>
          <input
            type="text"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
          />
          <label htmlFor="education">Educational Background:</label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
          {/* <label htmlFor="speciality">Speciality: </label>
         <select name="speciality" id="speciality">
            <option value="speciality 1">speciality 1</option>
            <option value="speciality 2">speciality 2</option>
            <option value="speciality 3">speciality 3</option>
            <option value="speciality 4">speciality 4</option>
            </select>   
        <input
        type="text"
        value={education}
        onChange={(e) => setEducation(e.target.value)}
        /> */}

          {/* <label htmlFor="speciality">Speciality: </label>
      <select
        options={specialityOptions}
        onChange={handleSpecialityChange}
      >
        {specialityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            
          </option>
        ))}
      </select>
      <ul>
        <li key={speciality}>
          {specialityOptions.find((option) => option === speciality)}
        </li>
      </ul> */}


          <label htmlFor="speciality"> Speciality:</label>
          <select onChange={handleSpecialityChange}>
            {/* options={specialityOptions}
 }
  defaultValue={specialityOptions[0]} */}
            <option value="speciality1">speciality1</option>
            <option value="speciality2">speciality2</option>
            <option value="speciality3">speciality3</option>
            {/* onChange={(e) => setSpeciality(e.target.value)}
  value={speciality} */}

          </select>

          <label htmlFor="ID">ID:</label>
          <input type="file" name="ID" accept=".jpg , .png , .pdf" onChange={handleFile1Change} />
          {/* <input
            type="file"
            name="ID"
            accept=".jpg , .png , .pdf"
            onChange={(e) => setID(URL.createObjectURL(e.target.files[0]))}
        /> */}
          <label htmlFor="degree">Medical Degree:</label>
          <input type="file" name="Degree" accept=".jpg , .png , .pdf" onChange={handleFile2Change} />

          {/* <input
            type="file"
            name="Degree"
            accept=".jpg , .png , .pdf"
            onChange={(e) => setDegree(URL.createObjectURL(e.target.files[0]))}
          /> */}


          <label htmlFor="license">License:</label>
          <input type="file" name="License" accept=".jpg , .png , .pdf" onChange={handleFile3Change} />
          {/* <input
            type="file"
            name="License"
            accept=".jpg , .png , .pdf"
            onChange={(e) => setLicense(URL.createObjectURL(e.target.files[0]))}
          /> */}


          <button type="submit" onClick={handleRegister}>Register</button>

        </form>
      </div>

    </div>
  );
}

export default RegistrationForm;