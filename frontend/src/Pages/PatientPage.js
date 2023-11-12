// import Patienttest from "../components/patient";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import AddHistory from "../components/AddHistory";



function PatientPage() {

    return (

        <AddHistory />

    );
}

export default PatientPage;



// function PatientPage() {
//     const [files, setFiles] = useState([]);
//     const [bData, setBData] = useState({});
//     const [Pt, setpt] = useState([]);

//     function setBinaryData(file, binaryString) {
//         setBData((prevData) => ({
//             ...prevData,
//             [file.name]: binaryString,
//         }));
//     }

//     function arrayBufferToBase64(buffer) {
//         let binary = '';
//         const bytes = new Uint8Array(buffer);
//         const len = bytes.byteLength;

//         for (let i = 0; i < len; i++) {
//             binary += String.fromCharCode(bytes[i]);
//         }

//         return btoa(binary);
//     }

//     useEffect(() => {
//         for (const file of files) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const arrayBuffer = e.target.result;
//                 const binaryString = arrayBufferToBase64(arrayBuffer);
//                 setBinaryData(file, binaryString);
//             };
//             reader.readAsArrayBuffer(file);
//             setFiles(files)
//         }
//     }, [files]);

//     const handleRegister = (event) => {
//         event.preventDefault();

//         const fileList = Array.from(files);
//         const formData = new FormData();

//         fileList.forEach((file) => {
//             formData.append('files', file);
//         });

//         axios.post('http://localhost:8000/patient/addHistory', formData, {
//             headers: {
//                 Authorization: 'Bearer ' + sessionStorage.getItem("token")
//             }
//         })
//             .catch(error => {
//                 console.log(error.response.data);
//                 console.log(error.response.status);
//                 console.log(error.response.headers);
//             });
//     }
// }
