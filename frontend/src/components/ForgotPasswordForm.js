// import React from "react";
import "../Styles/forgotPass.css";
import React, { useState } from 'react';
import validator from 'validator'
import Alert from '@mui/material/Alert';
//var x=1;
import { Link } from 'react-router-dom';

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
      setErrorMessagePass('Password has to be 8 characters long with at least 1 lowercase, 1 uppercase and 1 number ')
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
  const cancel = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    window.location.pathname = `/Health-Plus/`;
  }
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
        window.location.pathname = `/Health-Plus/`;

        
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
      <div>
<div className="background"></div>
      <div style={{ float: 'center', paddingTop: '122px' }}>

        <div id="login-form">
          {/* <h1>Sign up</h1> */}
          <form>
            <h5>Enter your email for OTP</h5>
            <br></br>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}></input> <br />
            {errorMessageEmail === '' ? null :
            <Alert severity="error">{errorMessageEmail}</Alert>
             }
 <button type="submit" style={{width:'49%',marginRight:'2%'}} onClick={cancel}>Cancel</button>
              <button type="submit" style={{width:'49%'}} onClick={sendOtp}>Get OTP</button>

          </form>
        </div>

      </div>
      </div>
    );
  }
  else {
    if (x === 2) {
      return (
        <div>
        <div className="background"></div>
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
                onChange={(e) => setOtp(e.target.value)}></input> 
                <Link onClick={sendOtp} variant="body2" style={{ float: 'right' }}>
                  {"Resend OTP?"}
                </Link><br/><br/>
                <button type="submit" style={{width:'49%',marginRight:'2%'}} onClick={cancel}>Cancel</button>
              <button type="submit" style={{width:'49%'}} onClick={verifyOtp}>Verify</button>

            </form>
          </div>
        </div>
        </div>
      );

    }
    else {
      return (
        <div>
        <div className="background"></div>
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
                
                
                   {errorMessagePass===''? null : errorMessagePass === 'Is Strong Password' ? <Alert severity="success">{errorMessagePass}</Alert> :
                <Alert severity="error">{errorMessagePass}</Alert>}
                 <br />
              
              <button type="submit" style={{width:'49%',marginRight:'2%'}} onClick={cancel}>Cancel</button>
              <button type="submit" style={{width:'49%'}} onClick={forgotPassword}>Submit</button>
            </form>
          </div>
          </div>
        </div>
      );

    }
  }
}

export default ForgotPasswordForm;
