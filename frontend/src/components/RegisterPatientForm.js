import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import validator from 'validator'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import '../Styles/SignUp.css';

function RegistrationForm() {
  
  const [isUsernameInvalid, setIsUsernameInvalid] = React.useState(false);
    const [isFirstNameInvalid, setIsFirstNameInvalid] = React.useState(false);
    const [isLastNameInvalid, setIsLastNameInvalid] = React.useState(false);
    const [isEmailInvalid, setIsEmailInvalid] = React.useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = React.useState(false);
    const [isDateInValid, setIsDateInValid] = React.useState(false);
    const [isGenderInvalid, setIsGenderInvalid] = React.useState(false);
    const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = React.useState(false);
    const [isEmergencyFirstNameInvalid, setIsEmergencyFirstNameInvalid] = React.useState(false);
    const [isEmergencyLastNameInvalid, setIsEmergencyLastNameInvalid] = React.useState(false);
    const [isEmergencyNumberInvalid, setIsEmergencyNumberInvalid] = React.useState(false);
    const [isFamilyRelationshipInvalid, setIsFamilyRelationshipInvalid] = React.useState(false);

    const [userName, setUserName] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [dateOfBirth, setDateOfBirth] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [emergencyFirstName, setEmergencyFirstName] = React.useState('');
    const [emergencyLastName, setEmergencyLastName] = React.useState('');
    const [emergencyNumber, setEmergencyNumber] = React.useState('');
    const [familyRelationship, setFamilyRelationship] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

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

    const handleChangePhoneNumber = (event) => {
        const phoneNumber = event.target.value;
        setPhoneNumber(phoneNumber)
    };

    const handleChangeEmergencyFirstName = (event) => {
        const name = event.target.value;
        setEmergencyFirstName(name)
    };

    const handleChangeEmergencyLastName = (event) => {
        const name = event.target.value;
        setEmergencyLastName(name)
    };

    const handleChangeFamilyRelationship = (event) => {
        const familyRelationship = event.target.value;
        setFamilyRelationship(familyRelationship)
    };

    const handleChangeEmergencyNumber = (event) => {
        const emergencyNumber = event.target.value;
        setEmergencyNumber(emergencyNumber)
    };

    const handleChangeGender = (event) => {
        const gender = event.target.value;
        setGender(gender)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsUsernameInvalid(false);
        setIsFirstNameInvalid(false);
        setIsLastNameInvalid(false);
        setIsEmailInvalid(false);
        setIsPasswordInvalid(false);
        setIsDateInValid(false);
        setIsPhoneNumberInvalid(false);
        setIsGenderInvalid(false);
        setIsEmergencyFirstNameInvalid(false);
        setIsEmergencyLastNameInvalid(false);
        setIsEmergencyNumberInvalid(false);
        setIsFamilyRelationshipInvalid(false);
        setErrorMessage('');
        let flag = true;
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
        if (phoneNumber == '') {
            setIsPhoneNumberInvalid(true);
            flag = false;
        }
        if (gender == '') {
            setIsGenderInvalid(true);
            flag = false;
        }
        if (emergencyFirstName === '') {
            setIsEmergencyFirstNameInvalid(true);
            flag = false;
        }
        if (emergencyLastName === '') {
            setIsEmergencyLastNameInvalid(true);
            flag = false;
        }
        if (familyRelationship === '') {
            setIsFamilyRelationshipInvalid(true);
            flag = false;
        }
        if (flag) {
            let myGender = ''
            if (gender) {
                myGender = 'male'
            } else {
                myGender = 'female'
            }
            let myRel = ''
            if (familyRelationship === 1) {
                myRel = 'Husband'
            }
            else if (familyRelationship === 2) {
                myRel = 'Wife'
            }
            else if (familyRelationship === 3) {
                myRel = 'Child'
            }
            else {
                myRel = ''
            }
            let data = {
                "username": userName,
                "name": firstName + " " + lastName,
                "email": email,
                "password": password,
                "mobile": phoneNumber,
                "dateOfBirth": dateOfBirth,
                "gender": myGender,
                "first": emergencyFirstName,
                "last": emergencyLastName,
                "emergencyNumber": emergencyNumber,
                "emergencyRel": myRel,
            }
            try {
                let response = await axios.post('http://localhost:8000/security/patient', data).then((response) => {
                    console.log(response.data);
                    if (response.data.success) {
                        sessionStorage.setItem('token', response.data.token);
                        // go to page patient
                        window.location.href = "http://localhost:3000/Health-Plus/patientHome";
                    }
                    else {
                        setErrorMessage(response.data.message)
                    }
                })
            } catch (err) {
                setErrorMessage(err.response.data.message)
            }
        }else{
            setErrorMessage('Please fill all the required fields')
        }
    };


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
            autoComplete="gender"
            id="standard-select-gender"
            name="gender"
            select
            label="Gender"
            fullWidth
            error={isGenderInvalid}
            onChange={handleChangeGender}
            value={gender}
          >
            <MenuItem value={true}>Male</MenuItem>
            <MenuItem value={false}>Female</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            type="number"  // Change type from 'number' to 'text'
            inputMode="numeric"  // Set input mode to 'numeric'
            pattern="[0-9]*"  // Set a pattern to only allow numeric input
            error={isPhoneNumberInvalid}
            onChange={handleChangePhoneNumber}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ height: '2px', background: 'black', width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            autoComplete="given-name"
            name="emergencyFirstName"
            required
            fullWidth
            id="emergencyFirstName"
            label="Emergency First Name"
            InputLabelProps={{
              style: { fontSize: 15, top: '-10px' },
              className: 'text-wrap'
            }}
            error={isEmergencyFirstNameInvalid}
            onChange={handleChangeEmergencyFirstName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            id="emergencyLastName"
            label="Emergency Last Name"
            name="emergencyLastName"
            autoComplete="family-name"
            InputLabelProps={{
              style: { fontSize: 15, top: '-10px' },
              className: 'text-wrap'
            }}
            error={isEmergencyLastNameInvalid}
            onChange={handleChangeEmergencyLastName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id="familyRelationship"
            name="familyRelationship"
            select
            label="Family Relationship"
            fullWidth
            InputLabelProps={{
              style: { fontSize: 15 },
            }}
            SelectProps={{
              inputProps: {
                classes: {
                  root: 'smallerFont', // Apply your styling class here
                },
              },
            }}
            error={isFamilyRelationshipInvalid}
            onChange={handleChangeFamilyRelationship}
            value={familyRelationship}
          >
            <MenuItem value={1}>Husband</MenuItem>
            <MenuItem value={2}>Wife</MenuItem>
            <MenuItem value={3}>Child</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="emergencyNumber"
            label="Emergency Number"
            name="emergencyNumber"
            autoComplete="tel"
            type="number"  // Change type from 'number' to 'text'
            inputMode="numeric"  // Set input mode to 'numeric'
            pattern="[0-9]*"  // Set a pattern to only allow numeric input
            error={isEmergencyNumberInvalid}
            onChange={handleChangeEmergencyNumber}
          />
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

export default RegistrationForm;
