import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

// ----------------------------------------------------------------------

export default function AcceptRejectDoctor() {

    const [doctors, setDoctors] = useState([]);

    const acceptDoctor = async (username) => {
        await axios(
            {
                method: 'post',
                url: `http://localhost:8000/admin/Acceptance/${username}`,
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response);
            setDoctors(response.data.Result);
        }).catch((error) => {
            console.log(error);
        });
    }

    const rejectDoctor = async (username) => {
        console.log(username);
        await axios(
            {
                method: 'delete',
                url: `http://localhost:8000/admin/Rejection/${username}`,
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response);
            setDoctors(response.data.Result);
        }).catch((error) => {
            console.log(error);
        });
    }

    const getDoctors = async () => {
        await axios(
            {
                method: 'get',
                url: 'http://localhost:8000/admin/fetchReqDoctors',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response);
            setDoctors(response.data.users);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getDoctors();
    }, []);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date of birth</th>
                    <th>Hourly Rate</th>
                    <th>Affiliation</th>
                    <th>Education</th>
                    <th>Speciality</th>
                    <th>Documents</th>
                    <th>Accept</th>
                    <th>Reject</th>
                </tr>
            </thead>
            <tbody>
                {doctors.map((doctor, index) => (
                    <tr>
                        <React.Fragment key={index}>
                            <td>{index + 1}</td>
                            <td>{doctor.Name}</td>
                            <td>{doctor.Email}</td>
                            <td>{doctor.DateOfBirth}</td>
                            <td>{doctor.HourlyRate}</td>
                            <td>{doctor.Affiliation}</td>
                            <td>{doctor.Education}</td>
                            <td>{doctor.Speciality}</td>
                            <td><button type="button" className="btn btn-success"  onClick={() => window.location.href=`/Health-Plus/viewRegDocDoc?Id=${doctor._id}`}>view Doc</button></td>
                            <td><button type="button" className="btn btn-success" onClick={(event) => { acceptDoctor(doctor.Username) }}>Accept</button></td>
                            <td><button type="button" className="btn btn-danger" onClick={(event) => { rejectDoctor(doctor.Username) }}>Reject</button></td>
                        </React.Fragment>
                    </tr>
                ))}
            </tbody>
        </Table >
    );
}