import React, { useState, useEffect } from 'react';
import axios from 'axios';



  

function ViewmyHealthRecords() {
    
    const [userHealthRecord, setUserHealthRecord] = useState([]);
const [userHealthHistory, setUserHealthHistory] = useState([]);
useEffect(() => {
    const fetchData = async () => {
        console.log(sessionStorage.getItem("token") )
        try {
            const response = await axios.get(`http://localhost:8000/patient/viewmyHealthRecords`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            const data = response.data;
               // console.log(aptmnts);
               console.log(data.Result)
               console.log(data.Result.healthRecords);
               setUserHealthRecord(data.Result.healthRecords)
               console.log(data.Result.medicalHistory)
               setUserHealthHistory(data.Result.medicalHistory)
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(error.response.data.message)
        }
    };

    fetchData();
  }, []);


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
                    {userHealthHistory.map((record, index) => (
                        <div key={index}>
                            <h3>Record {index + 1}</h3>
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