import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Form from 'react-bootstrap/Form';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// import Button from 'react-bootstrap/Button';
// import FileUploadIcon from '@mui/icons-material/FileUpload';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

function PatientHealthRecords() {
    const [userHealthRecord, setUserHealthRecord] = useState([]);
    const [index, setIndex] = useState(0);
    const [currentDocumentSrc, setCurrentDocumentSrc] = useState('');

    const uploadMedHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/patient/viewmyHealthRecords`,
                { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            const data = response.data;
            setUserHealthRecord(data.Result.healthRecords)
            if(data.Result.healthRecords.length>0){
                const src=`data:application/pdf;base64,${arrayBufferToBase64(data.Result.healthRecords[0].data)}`
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

    const handleChange = (event, value) => {
        setIndex(index);
          handleDocumentClick(userHealthRecord[value-1],value-1)
    };

    const handleDocumentClick = (record, index) => {
        setIndex(index)
        const src=`data:application/pdf;base64,${arrayBufferToBase64(record.data)}`
        setCurrentDocumentSrc(src)
    };
    

    useEffect(() => {
        uploadMedHistory();
    }, []);

    return (
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

                        <li key={`d`}>
                            <ul>
                                {userHealthRecord.map((record, index) => (
                                    <ListItemButton component="a" href="#simple-list">
                                        <ListItemText
                                            primary={'Document ' + (parseInt(index) + 1)}
                                            onClick={() => handleDocumentClick(record, index)}
                                        />
                                    </ListItemButton>
                                ))}
                            </ul>
                        </li>
                    </List>
                </div>
                <div style={{ width: "80%" }}>
                    <div style={{}}>
                        <Pagination style={{ display: 'flex', marginLeft: '300px' }} count={userHealthRecord.length} page={index + 1} onChange={handleChange} />
                        <Typography>Showing: Document {index + 1}</Typography>

                        <div>
                                <iframe src={currentDocumentSrc} width="800" height="600"></iframe>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default PatientHealthRecords;
