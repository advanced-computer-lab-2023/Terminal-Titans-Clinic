import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

  

function ViewmyHealthRecords() {
    
    const [userHealthRecord, setUserHealthRecord] = useState([]);
const [userHealthHistoryPDF, setUserHealthHistoryPDF] = useState([]);
const [userHealthHistoryIMG, setUserHealthHistoryIMG] = useState([]);
const [selectedFile, setSelectedFile] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/patient/viewmyHealthRecords`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            const data = response.data;
               // console.log(aptmnts);
               console.log(data.Result)
               console.log(data.Result.healthRecords);
               setUserHealthRecord(data.Result.healthRecords)
               console.log(data.Result.medicalHistoryPDF)
               setUserHealthHistoryPDF(data.Result.medicalHistoryPDF)
                setUserHealthHistoryIMG(data.Result.medicalHistoryImage)
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(error.response.data.message)
        }
    };

    fetchData();
  }, []);
  const handleFileChange = (e) => {
    // Handle file selection
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    // Handle file upload
    const formData = new FormData();
    formData.append('files', selectedFile);
    axios.post('http://localhost:8000/patient/addHistory', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + sessionStorage.getItem("token")
      }
    }).then(() => {
      alert('File uploaded successfully');
      window.location.reload(false);

    }).catch((err) => alert(err.message));
  }
async function deleteRecord(recordId) {
    try {
        console.log(recordId)
        const response = await axios.delete(`http://localhost:8000/patient/deleteMedicalHistory/${recordId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        window.location.reload(false);

    } catch (error) {
        console.error('Error fetching data:', error);
        alert(error.response.data.message)
    }
}
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
  
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  
    return btoa(binary);
  }
    return (

        <div>
                    <h1>My Health Records</h1>
                    <h2>Health Records</h2>
                    {userHealthRecord.map((record, index) => (
                        <div key={index}>
                            <h3>Record {index + 1}</h3>
                            {console.log(record.data)}
                            <iframe src={`data:application/pdf;base64,${arrayBufferToBase64(record.data)}`}  width="800" height="600"></iframe>
                            
                            {/* Add any other fields you want to display */}
                        </div>
                    ))}
                    <h2>Medical History</h2>
                    <h3>Add medical history</h3>
                    <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Default file input example</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>

      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <br></br>

                    {userHealthHistoryPDF.map((record, index) => (
                        <div key={index}>
                            <h3>Record {index + 1}</h3>
                            <button onClick={() => deleteRecord(record._id)}>Delete</button><br></br>

                         {console.log(record)}   
                         <iframe src={`data:application/pdf;base64,${arrayBufferToBase64(record.data.data)}`}  width="800" height="600"></iframe>
                            {/* Add any other fields you want to display */}

                        </div>
                    ))}
                    {userHealthHistoryIMG.map((record, index) => (
                        <div key={index}>
                            <h3>Record {index + 1}</h3>
                            <button onClick={() => deleteRecord(record._id)}>Delete</button><br></br>

                         {console.log(record)}   
                         <img
                          src={`data:image/jpeg;base64,${arrayBufferToBase64(record.data.data)}`}
                          
                      />

                            {/* Add any other fields you want to display */}
                        </div>
                    ))}
                   

            

        </div>
    );
}
export default ViewmyHealthRecords;