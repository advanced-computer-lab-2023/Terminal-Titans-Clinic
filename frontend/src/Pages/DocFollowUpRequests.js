import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import {DoctorNavBar} from '../components/doctorNavBar';

// ----------------------------------------------------------------------

const AcceptRejectFollowUp = () => {

    const [followUp, setFollowUp] = useState([]);

    const acceptFollowUp = async (id) => {
        await axios(
            {
                method: 'put',
                url: `http://localhost:8000/doctor/acceptfollowup/${id}`,
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response.data.list);
            setFollowUp(response.data.list);
        }).catch((error) => {
            console.log(error);
        });
    }

    const rejectFollowUp = async (id) => {
        await axios(
            {
                method: 'put',
                url: `http://localhost:8000/doctor/rejectfollowup/${id}`,
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response.data.list);
            setFollowUp(response.data.list);
        }).catch((error) => {
            console.log(error);
        });
    }

    const getFollowUps = async () => {
        await axios(
            {
                method: 'get',
                url: 'http://localhost:8000/doctor/getfollowups',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response.data.list);
            setFollowUp(response.data.list);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getFollowUps();
    }, []);

    return (
        <div>
        <DoctorNavBar/>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Patient Name</th>
                    <th>Family Member:</th>
                    <th>Requested Date:</th>
                    <th>Requested Time:</th>
                    <th>Accept</th>
                    <th>Reject</th>
                </tr>
            </thead>
            <tbody>
                {followUp.map((followUp, index) => (
                    <tr>
                        <React.Fragment key={index}>
                            <td>{index + 1}</td>
                            <td>{followUp.patientName}</td>
                            <td>{followUp.familyMemberName}</td>
                            <td>{followUp.Date?.substring(0,10)}</td>
                            <td>{followUp.Date?.substring(11,16)}</td>
                            <td><button type="button" className="btn btn-success" onClick={(event) => { acceptFollowUp(followUp._id) }}>Accept</button></td>
                            <td><button type="button" className="btn btn-danger" onClick={(event) => { rejectFollowUp(followUp._id) }}>Reject</button></td>
                        </React.Fragment>
                    </tr>
                ))}
            </tbody>
        </Table >
        </div>
    );
}

export default AcceptRejectFollowUp