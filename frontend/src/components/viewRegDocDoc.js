import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentCard from './DocumentCard';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';




function ViewRegDocDoc() {
  const [doctors, setDoctors] = useState([]);
  const params = new URLSearchParams(window.location.search);
  const id = params.get('Id');
  const navigate = useNavigate();


  const acceptDoctor = async (username) => {
    await axios(
        {
            method: 'post',
            url: `http://localhost:8000/admin/DoctorAcceptance/${username}`,
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
            url: `http://localhost:8000/admin/DoctorRejection/${username}`,
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
    try {
      const response = await axios.get('http://localhost:8000/admin/fetchReqDoctors', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      setDoctors(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/docApplicationList");
};

  useEffect(() => {
    getDoctors();
  }, []);

  const user = doctors.find((doctor) => doctor._id === id);
  console.log(user);

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <h1 style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>Doctor Information</h1>
      <Button variant="dark" style={{ width: '100%', background:"#000000b8" }} onClick={handleBack}>
          Go Back
        </Button>
        {user && (
        <div>
          <h2>{user.Name}</h2>
          <p>Email: {user.Email}</p>
          <p>Date of Birth: {user.DateOfBirth}</p>
          <p>Hourly Rate: {user.HourlyRate}</p>
          <p>Affiliation: {user.Affiliation}</p>
          <p>Education: {user.Education}</p>
          <p>Speciality: {user.Speciality}</p>

          <div style={{ whiteSpace: 'nowrap', overflowX: 'auto', margin: '20px' }}>
            <DocumentCard title="ID" imageData={user.ID} />
            <DocumentCard title="Degree" imageData={user.Degree} />
            <DocumentCard title="License" imageData={user.License} />
            {/* Add more documents as needed */}
          </div>
        </div>
      )}
    <Button variant="success" style={{ width: '48%', marginRight: '4%', marginTop: '4%' }} onClick={() => acceptDoctor(user.Username)}>
        Accept
    </Button>
    <Button variant="danger" style={{ width: '48%', marginTop: '4%' }} onClick={() => rejectDoctor(user.Username)}>
        Reject
    </Button>
    </div>
  );
}

export default ViewRegDocDoc;
