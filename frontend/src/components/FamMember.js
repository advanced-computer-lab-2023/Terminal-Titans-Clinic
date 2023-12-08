import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function FamilyMember() {
  const [regFamily, setRegFamily] = useState([]);
  const [unregFamily, setUnregFamily] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(null);
  const [nId, setNationalID] = useState(null);
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/patient/viewFamMem', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      const data = response.data;
      console.log("Family Members:", data.Result);
      setRegFamily(data.Result.registered);
      setUnregFamily(data.Result.unregistered);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(error.response.data.message);
    }
  };

  const handleAddFamilyMember = async () => {
    console.log("Request Body:", { name, age, nId, gender, relation });
    try {
      // Check if the relation is valid (wife, husband, or child)
      if (["wife", "husband", "child"].includes(relation.toLowerCase())) {
        const response = await axios.post(
          'http://localhost:8000/patient/addFamilyMem',
          {
            name,
            age,
            nId,
            gender,
            relation
          },
          { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        setSuccessMessage(response.data.message);
        fetchFamilyMembers();
      } else {
        setErrorMessage("Invalid relation. Please choose wife, husband, or child.");
      }
    } catch (error) {
      console.error('Error adding family member:', error);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <Card style={{ maxWidth: '600px', margin: 'auto', marginTop: '20px', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '20px', textAlign: 'center' }}>Add Family Member</h2>
        <form>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Age"
            variant="outlined"
            fullWidth
            margin="normal"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <TextField
            label="National ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nId}
            onChange={(e) => setNationalID(e.target.value)}
          />

          <TextField
            label="Gender"
            variant="outlined"
            fullWidth
            margin="normal"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="relation-label">Relation</InputLabel>
            <Select
              labelId="relation-label"
              id="relation"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              label="Relation"
            >
              <MenuItem value="wife">Wife</MenuItem>
              <MenuItem value="husband">Husband</MenuItem>
              <MenuItem value="child">Child</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleAddFamilyMember}>
            Add Family Member
          </Button>
        </form>
        {successMessage && <div style={{ marginTop: '10px', color: 'green' }}>{successMessage}</div>}
        {errorMessage && <div style={{ marginTop: '10px', color: 'red' }}>{errorMessage}</div>}
      </Card>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Family Members List</h2>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Relation</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {regFamily.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>{member.Name}</TableCell>
                  <TableCell>{member.Relation}</TableCell>
                  <TableCell>Registered</TableCell>
                </TableRow>
              ))}
              {unregFamily.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>{member.Name}</TableCell>
                  <TableCell>{member.Relation}</TableCell>
                  <TableCell>Unregistered</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default FamilyMember;
