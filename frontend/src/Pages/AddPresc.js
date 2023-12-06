import "../styles/addpresc.css"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Meds from "../components/Meds";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SplitButton from 'react-bootstrap/SplitButton';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const addPresc = () => {
  const [allMedicines, setAllMedicines] = useState([]);
  const [medicalUses, setMedicalUses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getMedicines = async () => {
      try {
        const response = await fetch('http://localhost:8000/Patient/getAllMedicine2/', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
        const jsonData = await response.json();

        if (Array.isArray(jsonData.meds)) {
          setAllMedicines(jsonData.meds);
        } else {
          console.error('Invalid data format. Expected an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getMedicines();
  }, []);

  const handleSearch = async () => {
    const inputValue = document.getElementById('searchInput').value;
    try {
      const response = await axios.get(`http://localhost:8000/Patient/getMedicine/${inputValue}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });

      if (response.status === 200) {
        const result = response.data.Result;

        if (result && result.Quantity > 0) {
          setAllMedicines([response.data.Result]);
        } else if (result && result.Quantity === 0) {
          setErrorMessage(`The medicine is out of stock. Here are some alternatives.`);

          // Set a timer to clear the error message after 2 minutes (adjust as needed)
          setTimeout(() => {
            setErrorMessage('');
          }, 4000); 

          const alternativesResponse = await axios.get(`http://localhost:8000/Patient/findAlternatives/${inputValue}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });

          if (alternativesResponse.status === 200) {
            setAllMedicines(alternativesResponse.data.Alternatives);
          } else {
            console.error('Failed to find alternatives. Unexpected response:', alternativesResponse);
          }
        }
      } else {
        console.error('Failed to search medicines. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMedicalUseFilter = async (medicalUse) => {
    try {
      const response = await axios.get(`http://localhost:8000/Patient/filterMedical/${medicalUse}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      if (response.status === 200) {
        setAllMedicines(response.data.Result);
      } else {
        console.error('Failed to filter medicines. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medicalUsesResponse = await axios.get('http://localhost:8000/Patient/getAllMedicalUses', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
        if (medicalUsesResponse.status === 200) {
          setMedicalUses(medicalUsesResponse.data.medicalUses);
        } else {
          console.error('Failed to get medical uses. Unexpected response:', medicalUsesResponse);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch initially
    fetchData();

    // Poll for updates every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Runs once on mount

  return (
    <div>
      <Navbar />
      <InputGroup className="mb-3">
        <SplitButton
          variant="outline-secondary"
          title="Search"
          id="segmented-button-dropdown-1"
          onClick={handleSearch}
        >
          <Dropdown.Header>Filter</Dropdown.Header>
          {medicalUses.map((use, index) => (
            <Dropdown.Item key={index} onClick={() => handleMedicalUseFilter(use)}>
              {use}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
        </SplitButton>
        <Form.Control
          id="searchInput"
          type="search"
          placeholder="Search"
          aria-label="Text input for search"
        />
      </InputGroup>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="addPresc">
        <h2 className="addPresc_title">Meds</h2>
        <div className="addPresc_meds">
          {Array.isArray(allMedicines) ? (
            allMedicines.map((medicine) => <Meds key={medicine.Name} medicines={[medicine]} />)
          ) : (
            <p>Error: Medicines data is not in the expected format.</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default addPresc;
