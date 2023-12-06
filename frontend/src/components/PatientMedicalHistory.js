import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Button from 'react-bootstrap/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

function PatientHealthRecords() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [upload, setUpload] = useState(false);
    const [index, setIndex] = useState(0);
    const [userHealthHistoryPDF, setUserHealthHistoryPDF] = useState([]);
    const [userHealthHistoryIMG, setUserHealthHistoryIMG] = useState([]);
    const [currentDocumentSrc, setCurrentDocumentSrc] = useState('');

    const uploadMedHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/patient/viewmyHealthRecords`,
                { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            const data = response.data;
            setUserHealthHistoryPDF(data.Result.medicalHistoryPDF)
            setUserHealthHistoryIMG(data.Result.medicalHistoryImage)
            if(data.Result.medicalHistoryPDF.length>0){
                const src=`data:${data.Result.medicalHistoryPDF[0].contentType};base64,${arrayBufferToBase64(data.Result.medicalHistoryPDF[0].data.data)}`
                setCurrentDocumentSrc(src)
            }
            else if(data.Result.medicalHistoryImage.length>0){
                const src=`data:${data.Result.medicalHistoryImage[0].contentType};base64,${arrayBufferToBase64(data.Result.medicalHistoryImage[0].data.data)}`
                setCurrentDocumentSrc(src)
            }

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
                Authorization: 'Bearer ' + sessionStorage.getItem("token")
            }
        }).then(() => {
            setUpload('true');

        }).catch((err) => alert(err.message));
    }

    async function deleteRecord(recordId) {
        try {
            const response = await axios.delete(`http://localhost:8000/patient/deleteMedicalHistory/${recordId}`, 
            { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
            window.location.reload(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(error.response.data.message)
        }
    }

    const handleChange = (event, value) => {
        setIndex(index);
        if(value<=userHealthHistoryPDF.length){
            handleDocumentClick(userHealthHistoryPDF[value-1],value-1)
          }
          else{
            handleDocumentClick(userHealthHistoryIMG[value-1-userHealthHistoryPDF.length],value-1)      }
    };

    const handleDocumentClick = (record, index) => {
        setIndex(index)
          const src=`data:${record.contentType};base64,${arrayBufferToBase64(record.data.data)}`
          setCurrentDocumentSrc(src)
    };
    

    useEffect(() => {
        uploadMedHistory();
        setUpload(false)
        setSelectedFile(null)
    }, [upload]);

    return (
        <div>
            <Form.Label>Upload Medical History</Form.Label>
            <Form.Group controlId="formFile" className="mb-3" style={{ display: "flex" }}>

                <Form.Control type="file" style={{ width: "80%", height: "10%" }} onChange={handleFileChange} />
                <Button variant="outline-dark" onClick={handleSubmit} style={{ padding: "0px 20px;" }}>
                    Upload <FileUploadIcon />
                </Button>

            </Form.Group>

            <div style={{ display: "flex" }}>

                <div style={{ width: " 20%" }}>
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 300,
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 300,
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                    >

                        <li key={`d`} style={{ marginTop: "5%" }}>
                            <ul>
                                {userHealthHistoryPDF.map((record, index) => (
                                    <ListItemButton component="a" href="#simple-list">
                                        <ListItemText
                                            primary={'Document ' + (parseInt(index) + 1)}
                                            onClick={() => handleDocumentClick(record, index)}
                                        />
                                        <Button variant="outline-danger" onClick={() => deleteRecord(record._id)}>Delete</Button>
                                    </ListItemButton>
                                ))}
                                {userHealthHistoryIMG.map((record, index) => (
                                    <ListItemButton component="a" href="#simple-list" >
                                        <ListItemText
                                            primary={'Document ' + (parseInt(index) + userHealthHistoryPDF.length + 1)}
                                            onClick={() => handleDocumentClick(record, index+userHealthHistoryPDF.length)}
                                           
                                        />
                                        <Button variant="outline-danger" onClick={() => deleteRecord(record._id)}>Delete</Button>
                                    </ListItemButton>
                                ))}
                            </ul>
                        </li>
                    </List>
                </div>
                <div style={{ width: "80%" }}>
                    <div style={{}}>
                        <Pagination style={{ display: 'flex', marginLeft: '300px' }} count={userHealthHistoryPDF.length + userHealthHistoryIMG.length} page={index + 1} onChange={handleChange} />
                        <Typography>Showing: Document {index + 1}</Typography>

                        <div>
                            {/* {currentDocumentSrc.includes('pdf') ? (
                                <iframe src={currentDocumentSrc} width="800" height="600"></iframe>
                            ) : (
                                <img src={currentDocumentSrc} style={{ width: '100%' }} />
                            )} */}
                                  <iframe src={currentDocumentSrc}  width="800" height="600"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientHealthRecords;
