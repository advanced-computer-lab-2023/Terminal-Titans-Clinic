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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import FamMember from "../Styles/FamMember.css"

function FamilyMember() {
  const [regFamily, setRegFamily] = useState([]);
  const [unregFamily, setUnregFamily] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [nId, setNationalID] = useState("");
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const [errName, setErrName] = useState(false);
  const [errAge, setErrAge] = useState(false);
  const [errNid, setErrNid] = useState(false);
  const [errGender, setErrGender] = useState(false);
  const [errRelation, setErrRelation] = useState(false);



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
      // if (!["wife", "husband", "child"].includes(relation.toLowerCase())) {

      // }
      let flag = true;
      if (name == "") {
        setErrName(true);
        flag = false
      }
      if (age == "") {
        setErrAge(true);
        flag = false
      }
      if (nId == "") {
        setErrNid(true);
        flag = false
      }
      if (gender == "") {
        setErrGender(true);
        flag = false
      }
      if (errRelation == "") {
        setErrRelation(true);
        flag = false
      }
      if (flag) {
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
        setOpen(false);
        setShow(true);
        fetchFamilyMembers();
      } else {
        setErrorMessage("Please fill all the fields")
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleClickOpen = () => {
    setErrAge(false);
    setErrGender(false);
    setErrName(false);
    setErrNid(false);
    setErrRelation(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ToastContainer
        className="p-3"
        position='top-end'
        style={{ zIndex: 1 }}
      >
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Successfull</strong>
          </Toast.Header>
          <Toast.Body>Added Family Member Successfuly</Toast.Body>
        </Toast>
      </ToastContainer>
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
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: 'right', borderBottom: 'unset' }}>
                  <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Family Member
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Family Member</DialogTitle>
        <DialogContent>
          {/* <Card style={{ maxWidth: '600px', margin: 'auto', borderRadius: '10px'}} > */}
          <form>
            <TextField
              error={errName}
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              error={errAge}
              label="Age"
              variant="outlined"
              type="number"
              fullWidth
              margin="normal"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <TextField
              error={errNid}
              label="National ID"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={nId}
              onChange={(e) => setNationalID(e.target.value)}
            />

            <TextField
              error={errGender}
              label="Gender"
              variant="outlined"
              fullWidth
              margin="normal"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />

            <FormControl fullWidth margin="normal" variant="outlined" error={errRelation}>
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
            <div className="flex justify-content-between">

            </div>
          </form>
          {successMessage && <div style={{ marginTop: '10px', color: 'green' }}>{successMessage}</div>}
          {errorMessage && <div style={{ marginTop: '10px', color: 'red' }}>{errorMessage}</div>}
          {/* </Card> */}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleAddFamilyMember}>
            Add Family Member
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FamilyMember;
