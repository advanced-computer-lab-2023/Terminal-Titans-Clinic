import axios from "axios";
import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';

function arrayBufferToBase64(buffer) {
  // Your implementation for converting array buffer to base64
}

function AddHistory() {
  const [files, setFiles] = useState([]);
  const [bData, setBData] = useState({});
  const [Pt, setPt] = useState([]);

  useEffect(() => {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const binaryString = arrayBufferToBase64(arrayBuffer);
        setBData((prevData) => ({
          ...prevData,
          [file.name]: binaryString,
        }));
      };
      reader.readAsArrayBuffer(file);
    }
  }, [files]);

  const handleRegister = (event) => {
    event.preventDefault();

    const fileList = Array.from(files);
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append('files', file);
    });

    axios.post('http://localhost:8000/patient/addHistory', formData, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem("token")
      }
    })
      .catch(error => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          type="file"
          name="files"
          accept=".png ,.jpg ,.pdf,.JPEG"
          multiple
          onChange={(e) => {
            console.log(e.target.files);
            setFiles(e.target.files);
            console.log(files); // Check if files state is updated
          }}
        />
        <Button variant="primary" onClick={handleRegister}>Add</Button>
      </InputGroup>
    </div>
  );
}

export default AddHistory;
