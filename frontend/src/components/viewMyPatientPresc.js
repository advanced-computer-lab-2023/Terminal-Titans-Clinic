import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profileImage from "../Assets/profile.png";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton';
import Button from 'react-bootstrap/Button';
function ViewMyPatientPresc(){
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get('Id');
    const [myPatient, setMyPatient] = useState({});
    const [medicines, setMedicines]= useState([]);
    const [prescs, setPrescs]= useState([]);
    const [currPresc, setCurrPresc] = useState({});
    const [medsText, setMedsText] = useState('');
    const [prescId, setPrescId] = useState('');

    const getMyPatientPrescs = async() =>{
        try{
            await axios.get(`http://localhost:8000/doctor/getPrescriptions/${patientId}`, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                  }
            }).then(
            (res) => {
                console.log(res.data.result1);

                setPrescs(res.data.result1.presc);
            }
        );
        }
        catch(error){
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        getMyPatientPrescs();
    }, []);

    const showPresc = async (index) => {
        setCurrPresc(prescs[index]);
        setMedicines(currPresc.medicines);
        let text = '';
        for (let i = 0; i < medicines.length; i++) {
            text += medicines[i].name + ' ' + medicines[i].dosage + '\n';
        }
        setMedsText(text);
    }

    const addPrescription = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/doctor/addPrescription/${patientId}`, {}, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }
            });
            const data = response.data;
            
            console.log(data.result.result1);
            setPrescId(data.result.result1);

            window.location.href = `/Health-Plus/addPresc?Id=${data.result.result1}`;
        } catch (error) {
            console.error('Error:', error);
        }
    }


    // const addPrescription = async() =>{
    //     try{
    //         await axios.post(`http://localhost:8000/doctor/addPrescription/${patientId}`, {
    //             headers: {
    //                 Authorization: 'Bearer ' + sessionStorage.getItem("token")
    //               }
    //         }).then(
    //         (res) => {
    //             const data = res.data;
    //             console.log(data);
    //             setPrescId = data.result;
    //             window.location.pathname=`/Health-Plus/viewMyPatientInfo?Id=${prescId}`
    //         }
    //     );
    //     }
    //     catch(error){
    //         console.error('Error:', error);
    //     }
    // }

    



    return (
        <div style={{ display: "flex"}}>
              <div style={{width:" 20%"}}>
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
                    <div className="form-group">
                                            <Button variant="contained" onClick={addPrescription}>Add Prescription</Button> {/* Add this line */}
                                        </div>
                        
                      {prescs.map((index) => (
                        <ListItemButton component="a" href="#simple-list">
        
                                <ListItemText primary={'presc ' + (parseInt(index) + 1)} onClick={() => { showPresc(index) }} />
                               
                            </ListItemButton>
                    
                  
                ))}
                 {/* {userHealthHistoryIMG.map((item,index) => (
                        <ListItemButton component="a" href="#simple-list">
        
                                <ListItemText primary={'Document ' + (parseInt(index) +Prescs.length+1 )} onClick={() => { showDoc(item,index+userHealthHistoryPDF.length) }} />
                               
                            </ListItemButton>
                    
                  
                ))} */}
                </ul>
                </li>
              </List>
              </div>
              <div style={{width: "80%"}}>
              <div id="login-form"  style={{ width: "600px " }}>
                <form>
                    
                    <div className="form-group">
                       
                       <input type="text" id="name"  style={{width: "50%", border:"0px", padding:'8px'}} value='PrescriptionId' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={currPresc.prescId} readOnly />

                        <input type="text" id="Date"  style={{width: "50%", border:"0px", padding:'8px'}} value='Prescription Date' readOnly />
                        <input type="text" id="Date"  style={{width: "50%", border:"0px", padding:'8px'}} value={currPresc.date?.substring(0,10)} readOnly />

                        <input type="text" id="Status"  style={{width: "50%", border:"0px", padding:'8px'}} value='Status' readOnly />
                        <input type="text" id="Status"  style={{width: "50%", border:"0px", padding:'8px'}} value={currPresc.status} readOnly />
                        <input type="text" id="Meds"  style={{width: "50%", border:"0px", padding:'8px'}} value='Meds' readOnly />
                        <input type="text" id="Meds"  style={{width: "50%", border:"0px", padding:'8px'}} value={medsText} readOnly />
                        <input type="text" id="editPresc"  style={{width: "50%", border:"0px", padding:'8px'}} value='Edit Prescription'  />
                        <input
                            type="button"
                            id="editPresc"
                            style={{ width: "50%", border: "0px", padding: "8px" }}
                            value="Edit Prescription"
                            onClick={() =>  window.location.href=`/Health-Plus/addPresc?Id=${currPresc.id}`}
                            disabled={currPresc.status === "filled"}
                            
                        />
                        {/* <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value='Emergency Contact' readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.EmergencyName} readOnly />
                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px", padding:'8px'}} value='Emergency Mobile' readOnly />
                        <input type="text" id="EmergencyMobile"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.EmergencyMobile} readOnly />
                        <input type="text" id="EmergencyContactRelationToThePatient"  style={{width: "50%", border:"0px", padding:'8px'}} value='Relation' readOnly />
                        <input type="text" id="EmergencyContactRelationToThePatient"  style={{width: "50%", border:"0px", padding:'8px'}} value={myPatient.EmergencyContactRelationToThePatient} readOnly /> */}
                 
                 
                    </div>

                </form>
            </div>
              <div >
              </div>
            </div>
            </div>
    )
}
export default ViewMyPatientPresc;
