import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

// ----------------------------------------------------------------------

const AcceptRejectPharmacist = () => {

    const [pharmacists, setPharmacists] = useState([]);

    const acceptPharmacist = async (username) => {
        await axios(
            {
                method: 'post',
                url: `http://localhost:8000/admin/PharmAcceptance/${username}`,
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response);
            setPharmacists(response.data.Result);
        }).catch((error) => {
            console.log(error);
        });
    }

    const rejectPharmacist = async (username) => {
        console.log(username);
        await axios(
            {
                method: 'delete',
                url: `http://localhost:8000/admin/PharmRejection/${username}`,
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response);
            setPharmacists(response.data.Result);
        }).catch((error) => {
            console.log(error);
        });
    }

    const getPharmacists = async () => {
        await axios(
            {
                method: 'get',
                url: 'http://localhost:8000/admin/viewReqPharm',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response);
            setPharmacists(response.data.Result);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getPharmacists();
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
                    <th>Affiliation</th>
                    <th>View Doc</th>
                    <th>Accept</th>
                    <th>Reject</th>
                </tr>
            </thead>
            <tbody>
                {pharmacists.map((pharmacist, index) => (
                    <tr>
                        <React.Fragment key={index}>
                            <td>{index + 1}</td>
                            <td>{pharmacist.Name}</td>
                            <td>{pharmacist.Email}</td>
                            <td>{pharmacist.DateOfBirth}</td>
                            <td>{pharmacist.HourlyRate}</td>
                            <td>{pharmacist.Affiliation}</td>
                            <td>{pharmacist.EducationalBackground}</td>
                            <td>{pharmacist.Affiliation}</td>
                            <td><button type="button" className="btn btn-success"  onClick={() => window.location.href=`viewReqPharmcDoc?Id=${pharmacist._id}`}>view Doc</button></td>
                            <td><button type="button" className="btn btn-success" onClick={(event) => { acceptPharmacist(pharmacist.Username) }}>Accept</button></td>
                            <td><button type="button" className="btn btn-danger" onClick={(event) => { rejectPharmacist(pharmacist.Username) }}>Reject</button></td>
                        </React.Fragment>
                    </tr>
                ))}
            </tbody>
        </Table >
    );
}

export default AcceptRejectPharmacist