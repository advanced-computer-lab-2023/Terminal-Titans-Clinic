import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import validator from 'validator'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import '../Styles/SignUp.css';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function PharmacyRegistrationForm() {

  const [isUsernameInvalid, setIsUsernameInvalid] = React.useState(false);
  const [isFirstNameInvalid, setIsFirstNameInvalid] = React.useState(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = React.useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = React.useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = React.useState(false);
  const [isDateInValid, setIsDateInValid] = React.useState(false);
  const [isAffiliationInvalid, setisAffiliationInvalid] = React.useState(false);
  const [isHourlyRateInvalid, setIsHourlyRateInvalid] = React.useState(false);
  const [isEducationInvalid, setIsEducationInvalid] = React.useState(false);

  const [userName, setUserName] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [affiliation, setAffiliation] = React.useState('');
  const [hourlyRate, setHourlyRate] = React.useState('');
  const [education, setEducation] = React.useState('');
  const [iD, setID] = React.useState('');
  const [degree, setDegree] = React.useState('');
  const [license, setLicense] = React.useState('');

  const [errorMessage, setErrorMessage] = React.useState('');

  const [file1, setFile1] = useState(null);
  const [binaryData1, setBinaryData1] = useState(null);

  const [file2, setFile2] = useState(null);
  const [binaryData2, setBinaryData2] = useState(null);

  const [file3, setFile3] = useState(null);
  const [binaryData3, setBinaryData3] = useState(null);

  const handleFile1Change = (e) => {
    document.getElementById('idBtn').style.backgroundColor = '#4caf50';
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    document.getElementById('degreeBtn').style.backgroundColor = '#4caf50';
    setFile2(e.target.files[0]);
  };

  const handleFile3Change = (e) => {
    document.getElementById('licBtn').style.backgroundColor = '#4caf50';
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

  const handleChangeUserName = (event) => {
    const name = event.target.value;
    setUserName(name)
  };

  const handleChangeFirstName = (event) => {
    const name = event.target.value;
    setFirstName(name)
  };

  const handleChangeLastName = (event) => {
    const name = event.target.value;
    setLastName(name)
  };

  const handleChangeEmail = (event) => {
    const email = event.target.value;
    setEmail(email)
  };

  const handleChangePassword = (event) => {
    const password = event.target.value;
    setPassword(password)
  };

  const handleChangeDateOfBirth = (event) => {
    console.log(event.$d);
    const dateOfBirth = event.$d;
    setDateOfBirth(dateOfBirth)
  };



  const handleChangeHourlyRate = (event) => {
    const hourlyRate = event.target.value;
    setHourlyRate(hourlyRate)
  };

  const handleChangeAffiliation = (event) => {
    const affiliation = event.target.value;
    setAffiliation(affiliation)
  };

  const handleChangeEducation = (event) => {
    const education = event.target.value;
    setEducation(education)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUsernameInvalid(false);
    setIsFirstNameInvalid(false);
    setIsLastNameInvalid(false);
    setIsEmailInvalid(false);
    setIsPasswordInvalid(false);
    setIsDateInValid(false);
    setisAffiliationInvalid(false);
    setIsHourlyRateInvalid(false);
    setIsEducationInvalid(false);
    setErrorMessage('');
    let flag = true;
    let message = ''
    if (userName === '') {
      setIsUsernameInvalid(true);
      flag = false;
    }
    if (firstName === '') {
      setIsFirstNameInvalid(true);
      flag = false;
    }
    if (lastName === '') {
      setIsLastNameInvalid(true);
      flag = false;
    }
    if (email === '') {
      setIsEmailInvalid(true);
      flag = false;
    }
    if (password === '' || !validator.isStrongPassword(password, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 0
    })) {
      setIsPasswordInvalid(true);
      flag = false;
    }
    if (dateOfBirth === '') {
      setIsDateInValid(true);
      flag = false;
    }
    if (affiliation === '') {
      setisAffiliationInvalid(true);
      flag = false;
    }
    if (hourlyRate === '') {
      setIsHourlyRateInvalid(true);
      flag = false;
    }
    if (education === '') {
      setIsEducationInvalid(true);
      flag = false;
    }
    if (flag) {
      const formData = new FormData();
      // Create a JSON object with the username and password
      formData.append('username', userName);
      formData.append('password', password);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('name', firstName + ' ' + lastName);
      formData.append('email', email);
      formData.append('hourlyRate', hourlyRate);
      formData.append('affiliation', affiliation);
      formData.append('education', education);
      formData.append('ID', iD)
      formData.append('Degree', degree);
      formData.append('License', license);
      try {
        let response = await axios.post('http://localhost:8000/security/pharmacist', formData).then((response) => {
          console.log(response.data);
          if (response.data.success) {
            // go to page patient
            window.location.href = "http://localhost:3000/Health-Plus/signIn";
          }
          else {
            setErrorMessage(response.data.message)
          }
        })
      } catch (err) {
        setErrorMessage(err.response.data.message)
      }
    } else {
      setErrorMessage('Please fill all the required fields')
    }
  }


  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            autoComplete="given-name"
            name="username"
            required
            fullWidth
            id="username"
            label="User Name"
            isInvalid={false}
            error={isUsernameInvalid}
            onChange={handleChangeUserName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            error={isFirstNameInvalid}
            onChange={handleChangeFirstName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            error={isLastNameInvalid}
            onChange={handleChangeLastName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            error={isEmailInvalid}
            onChange={handleChangeEmail}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            error={isPasswordInvalid}
            onChange={handleChangePassword}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker required fullWidth id="dateOfBirth" name="dateOfBirth" error={isDateInValid} onChange={handleChangeDateOfBirth} />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            id="hourlyRate"
            label="Hourly Rate"
            name="hourlyRate"
            type="number"  // Change type from 'number' to 'text'
            inputMode="numeric"  // Set input mode to 'numeric'
            pattern="[0-9]*"  // Set a pattern to only allow numeric input
            error={isHourlyRateInvalid}
            onChange={handleChangeHourlyRate}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            name="affiliation"
            label="Affiliation"
            id="affiliation"
            error={isAffiliationInvalid}
            onChange={handleChangeAffiliation}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="education"
            label="Educational Background"
            name="education"
            type="text"  // Change type from 'number' to 'text'
            error={isEducationInvalid}
            onChange={handleChangeEducation}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth id='idBtn'>
            Upload ID
            <VisuallyHiddenInput type="file" onChange={handleFile1Change} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth id='degreeBtn'>
            Upload Degree
            <VisuallyHiddenInput type="file" onChange={handleFile2Change} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth id='licBtn'>
            Upload License
            <VisuallyHiddenInput type="file" onChange={handleFile3Change} />
          </Button>
        </Grid>
      </Grid>
      {errorMessage == '' ? '' :
        <Alert severity="error" className='mt-2'>{errorMessage}!</Alert>
      }
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign Up
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="http://localhost:3000/Health-Plus/signIn" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PharmacyRegistrationForm;