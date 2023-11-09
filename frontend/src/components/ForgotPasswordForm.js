// import React from "react";
import "../Styles/LoginForm.css";
import React, { useState } from 'react';
import validator from 'validator'

//var x=1;


function ForgotPasswordForm() {
  const [x, setX] = useState(1);

  const [email, setEmail] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('')
  const [otp, setOtp] = useState('');
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
  const validateEmail = (value) => {
    setEmail(value);
    if (validator.isEmail(value)) {
      setErrorMessageEmail('')
    } else {

      setErrorMessageEmail('Enter a valid email')
    }
  }
  const sendOtp = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { email };
    if (validator.isEmail(email)) {
      // Make a POST request to your backend register route
      fetch('http://localhost:8000/security/sendOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json()).then(data => {
          if (data.success ) {
            //alert("OTP sent to your email")
            setX(2);
          }
          else{
            alert(data.message)
          }          
        })
        .catch((error) => {
          // Handle network errors or other issues
          //setX(2)
          console.error('Error:', error);
        });
    }
  };
  const verifyOtp = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { email, otp };
    console.log(otp)
    // Make a POST request to your backend register route
    fetch('http://localhost:8000/security/verifyOTP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json()).then(data => {
        if (data.success ) {
          //alert("OTP sent to your email")
          setX(3);
        }
        else{
          alert(data.message)
        }          
      

      })
      .catch((error) => {
        console.error('Error:', error);
      });

  };
  const forgotPassword = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { email, password };
    if (password !== '' && validator.isStrongPassword(password, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 0
    })) {
    // Make a POST request to your backend register route
    fetch('http://localhost:8000/security/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json()).then(data => {
      if (data.success ) {
        alert("Password Changed Successfully")
        //redirect to home page
        
      }
      else{
        alert(data.message)
      }          
    })
      .catch((error) => {
        console.error('Error:', error);
      });
    }

  };
  if (x === 1) {
    return (

      <div style={{ float: 'center', paddingTop: '122px' }}>

        <div id="login-form">
          {/* <h1>Sign up</h1> */}
          <form>
            <h5>Enter the email address associated with your account and we'll send you an OTP</h5>
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


            <button type="submit" onClick={sendOtp}>Register</button>

          </form>
        </div>

      </div>
    );
  }
  else {
    if (x === 2) {
      return (
        <div style={{ float: 'center', paddingTop: '122px' }}>

          <div id="login-form">
            {/* <h1>Sign up</h1> */}
            <form>
              <h5>Enter the OTP sent to your email</h5>
              <br></br>
              <label htmlFor="otp">OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}></input> <br />
              <button type="submit" onClick={verifyOtp}>verify</button>

            </form>
          </div>
        </div>
      );

    }
    else {
      return (
        <div style={{ float: 'center', paddingTop: '122px' }}>

          <div id="login-form">
            {/* <h1>Sign up</h1> */}
            <form>
              <h5>Enter your new Password</h5>
              <br></br>
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
              <button type="submit" onClick={forgotPassword}>Submit</button>

            </form>
          </div>
        </div>
      );

    }
  }
}

export default ForgotPasswordForm;
