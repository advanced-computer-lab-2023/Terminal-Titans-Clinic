import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import RegisterPatientForm from "./RegisterPatientForm";
import RegisterDoctorForm from "./RegisterDoctorForm";
import RegisterPharmacistForm from "./RegisterPharmacistForm";
import '../Styles/SignUp.css';

// TODO remove, this demo shouldn't need to reset the theme.

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function SignUp() {

    const [title, setTitle] = React.useState('Patient');

    const handleChangeTitle = (e) => {
        console.log(e.target.innerText);
        setTitle(e.target.innerText);
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up as
                        <DropdownButton variant='light' title={title} className='inline-block dropDownSignUp' onClick={handleChangeTitle}>
                            <Dropdown.Item eventKey="1">Patient</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Doctor</Dropdown.Item>
                            <Dropdown.Item eventKey="3">
                                Pharmacist
                            </Dropdown.Item>
                        </DropdownButton>
                    </Typography>
                    {title === 'Patient' ? <RegisterPatientForm />
                        : title === 'Doctor' ? <RegisterDoctorForm />
                            : <RegisterPharmacistForm />}
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider >
    );
}