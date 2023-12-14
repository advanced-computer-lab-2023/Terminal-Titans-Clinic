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
    <div>
    

  <div>

      <div id="login-form"  style={{ width: "600px " }}>
          <form style={{paddingTop:'15px'}}>
              <h1 style={{ backgroundColor: 'black', color: 'white', padding: '10px',borderRadius:'15px' ,marginTop:'5px' }}>Doctor Information</h1>
              <div className="form-group">
              {user && ( 
              <div style={{paddingTop:'15px'}}>
                <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value='Name' readOnly />
                <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={user.Name} disabled />

                <input type="text" id="Username"  style={{width: "50%", border:"0px",padding:'8px'}} value='Username' readOnly />
                <input type="text" id="outlined-disabled" style={{width: "50%", border:"0px",padding:'8px'}} value={user.Username} disabled />
                

                <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px",padding:'8px'}} value='Date of birth' readOnly />
                <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px",padding:'8px'}} value={user.DateOfBirth} disabled />

                <input type="text" id="Email"  style={{width: "50%", border:"0px",padding:'8px'}} value='Email' readOnly />
                <input type="text" id="Email"  style={{width: "50%", border:"0px",padding:'8px'}} value={user.Email} disabled/>

                <input type="text" id="Affiliation"  style={{width: "50%", border:"0px",padding:'8px'}} value='Affiliation' readOnly />
                <input type="text" id="Affiliation"  style={{width: "50%", border:"0px",padding:'8px'}} value={user.Affiliation} disabled/>


                <input type="text" id="Education"  style={{width: "50%", border:"0px",padding:'8px'}} value='Education' readOnly />
                <input type="text" id="Education"  style={{width: "50%", border:"0px",padding:'8px'}} value={user.Education}  disabled/>

                <input type="text" id="HourlyRate"  style={{width: "50%", border:"0px",padding:'8px'}} value='Hourly Rate' readOnly />
                <input type="text" id="HourlyRate"  style={{width: "50%", border:"0px",padding:'8px'}} value={user.HourlyRate} disabled/>
                <input type="text" id="Speciality"  style={{width: "50%", border:"0px",padding:'8px'}} value='Speciality' readOnly />
                <input type="text" id="Speciality"  style={{width: "50%", border:"0px",padding:'8px'}} value={user.Speciality} disabled />
                <div style={{ whiteSpace: 'nowrap', overflowX: 'auto', margin: '20px' }}>
                  <DocumentCard title="ID" imageData={user.ID} />
                  <DocumentCard title="Degree" imageData={user.Degree} />
                  <DocumentCard title="License" imageData={user.License} />
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

          </form>
      </div>
  </div>
  </div>
  );

}

export default ViewRegDocDoc;
