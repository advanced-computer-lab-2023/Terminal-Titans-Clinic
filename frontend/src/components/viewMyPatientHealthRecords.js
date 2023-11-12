import React, { useState, useEffect } from 'react';
import axios from 'axios';




function ViewmyPatientsHealthRecords() {
    const [myPatients, setMyPatients] = useState([]);
    const [curPatientId, setcurPatientId] = useState('');
    const [curDoc, setCurDoc] = useState('');

    const [userHealthRecord, setUserHealthRecord] = useState([]);
const [userHealthHistory, setUserHealthHistory] = useState('');
useEffect(() => {
    const fetchData = async () => {
        
        try {
            const response = await axios.get(`http://localhost:8000/doctor/getPatientsList`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            const data = response.data;
               // console.log(aptmnts);
               console.log(data.Result)
               setMyPatients(data.Result)
               if(myPatients.length > 0){
                console.log(myPatients[0]._id)
                setcurPatientId(myPatients[0]._id)
               }
               console.log(myPatients.length)
               
               console.log(curPatientId)
               //setUserHealthHistory(data.Reult.medicalHistory)
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(error.response.data.message)

        }
    };

    fetchData();
  }, []);

async function viewPatientsDoc(){
    console.log(curPatientId)
    try {
        if(curPatientId === ''){
            if(myPatients.length > 0){
                console.log(myPatients[0]._id)
                setcurPatientId(myPatients[0]._id)
               }
        }
            const response = await axios.get(`http://localhost:8000/doctor/getPatientInfoAndHealth/${curPatientId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            const data = response.data;
                 // console.log(aptmnts);
                 

                 setUserHealthRecord(data.Result.healthDoc)
                 console.log(data.Result.patient.HealthHistory.data)
                 setCurDoc('')
                 setUserHealthHistory(data.Result.patient.HealthHistory)
    } catch (error) {
            console.error('Error fetching data:', error);
    }
}
const viewCurDoc = (event) =>{
    console.log('k')
    const selectedOption = event.target.options[event.target.selectedIndex];
    console.log(userHealthRecord[selectedOption.value])
    setCurDoc(userHealthRecord[selectedOption.value].data)
    console.log(curDoc)
}
const handlePatientChange = (event) =>{
    const selectedOption = event.target.options[event.target.selectedIndex];
   // console.log(userHealthRecord[selectedOption.value])
    setcurPatientId(selectedOption.value)
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
              
                    {myPatients.length > 0 ? (
                        <div>
                        <select onChange={handlePatientChange}>
                            {myPatients.map(patient => (
                                <option key={patient._id} value={patient._id} 
                                onChange={() => setcurPatientId(patient._id)}>{patient.Name}</option>
                            ))}
                        </select>
                        <button  onClick={viewPatientsDoc}>
                        view Patients Doc
                        </button>
                        { userHealthRecord.length>0?(
                            <div>
                                <select onChange={viewCurDoc}>
                                    {userHealthRecord.map((userHealthRecord, index) => (
                                        <option key={index} value={index}>Record {index+1}   
                                         </option>
                                        
                                    ))}
                                </select>
                               
                                
                                {/* <button  onClick={viewCurDoc} >
                                    view  Doc
                                </button> */}
                                
                            </div>
                        ) : (
                            <p></p>
                        )}
                        </div>
                    ) : (
                        
                        <h1>You don't have any registered patients.</h1>
                    )}
                    <br></br>
                    {/* <button  onClick={viewCurDoc} >
                                    view  Doc
                                </button> */}
                    <div>
                        
                            {curDoc !== ''? (
                            <iframe src={`data:application/pdf;base64,${arrayBufferToBase64(curDoc)}`}  width="800" height="600"></iframe>

                            ):(<div>this patient doesnt have any health Douments</div>)}
                            </div>
                            <div>
                            {userHealthHistory.data ? (
                            <iframe src={`data:application/pdf;base64,${arrayBufferToBase64(userHealthHistory.data)}`}  width="800" height="600"></iframe>
                            ):(<div>this patient doesnt have any health history</div>)}
                            </div>
                    <br></br>
                    
        </div>
    );
}
export default ViewmyPatientsHealthRecords;