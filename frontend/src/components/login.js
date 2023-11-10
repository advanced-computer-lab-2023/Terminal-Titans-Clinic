import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        axios.post('http://localhost:8000/security/login', formData).then((response) => {
            console.log(response);
            if (response.data.success) {
                sessionStorage.setItem('token', response.data.Result.token);
                if (response.data.type === 'Admin') {
                    // go to admin page
                }
                else if (response.data.type === 'Doctor') {
                    // go to doctor page
                }
                else {
                    // go to patient page
                }
            }
            else {
                alert(response.data.message);

            }
        }).catch((error) => {
            console.log(error);
            alert(error.response.data.message);
        });

        // await fetch('http://localhost:8000/security/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData),
        // }).then((response) => {
        //     if (response.success) {
        //         sessionStorage.setItem('token', response.token);
        //         if (response.Result.type === 'Admin') {
        //             // go to admin page
        //         }
        //         else if (response.Result.type === 'Doctor') {
        //             // go to doctor page
        //         }
        //         else {
        //             // go to patient page
        //         }
        //     }
        //     else {
        //         console.log(response);
        //         alert(response.message);

        //     }
        // }
        // );
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>

            <a href="http://localhost:3000/Health-Plus/registerPatient">Register as a patient</a>
            <br />
            <a href="http://localhost:3000/Health-Plus/registerDoctor">Register as a doctor</a>
        </Form>
    );
}

export default Login;