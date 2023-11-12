import "../Styles/LoginForm.css";
import React, { useState } from 'react';
import validator from 'validator'
import axios from 'axios';

function ChangePasswordForm() {
    const [oldPassword, setoldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessagePass, setErrorMessagePass] = useState('')
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
    const changePassword =async  (event) => {
      console.log(sessionStorage.getItem("token"))
      event.preventDefault(); // Prevent the default form submission behavior
  
      // Create a JSON object with the username and password
      const data = {password,oldPassword  };
      // fetch('http://localhost:8000/security/sendOTP', {
      //   method: 'POST',
      //   { data},
      //   { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
      // ).then((response) => response.json()).then(data => { 
  //   const response = await axios.post(
  //     `http://localhost:8000/security/changePassword`,
  //     { password,oldPassword },
  //     { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
  // );
  // if(response){
  //   var res=response.data;
  //   if (res.success ) {
  //     alert("Password Changed Successfully")
  //   }
  //   else{
  //     alert(res.message)
  //   }
  // }

     fetch('http://localhost:8000/security/changePassword', {
        method: 'POST',
        headers:{  'Content-Type': 'application/json',Authorization: 'Bearer ' + sessionStorage.getItem("token") },
        body: JSON.stringify(data),
      }).then((response) => response.json()).then(data => {
        if (data.success ) {
          alert("Password Changed Successfully")
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
        
      
    };
      return (
        <div style={{ float: 'center', paddingTop: '110px' }}>

        <div id="login-form">
          {/* <h1>Sign up</h1> */}
          <form>
            <h5>Enter your new Password</h5>
            <br></br>
            <label htmlFor="oldPassword">old Password:</label>
            <input
              type="password"
              value={oldPassword}
             onChange={(e) => setoldPassword(e.target.value)}></input> <br />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              value={password}
             onChange={(e) => validatePass(e.target.value)}></input> <br />
              {errorMessagePass === '' ? null :
                <h5 style={{
                  color: 'red',
                }}>{errorMessagePass}</h5>}
               <br />
            <button type="submit" onClick={changePassword}>Submit</button>

          </form>
        </div>
      </div>
    );
            }
  
  export default ChangePasswordForm;
  