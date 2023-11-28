import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewReqPharmDoc() {
    const [doctors, setDoctors] = useState([]);
    const params = new URLSearchParams(window.location.search);

    const id = params.get('Id');
    const getDoctors = async () => {
        await axios(
            {
                method: 'get',
                url: 'http://localhost:8000/admin/viewReqPharm',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response.data.Result);
            setDoctors(response.data.Result);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getDoctors();
    }, []);
    console.log(doctors)
    var user=doctors.filter((doctor)=>doctor._id===id);
    console.log(user)
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
      
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
      
        return btoa(binary);
      }
    return(
        <div>
        {user.map((record, index) => (
            <div key={index}>
                <h3>Id:</h3>
                
                <img src={`data:image/jpeg;base64,${arrayBufferToBase64(record.ID.data.data)}`} ></img>
                <h3>Degree:</h3>
                
                <img src={`data:image/jpeg;base64,${arrayBufferToBase64(record.Degree.data.data)}`} ></img>
                <h3>License:</h3>
                
                <img src={`data:image/jpeg;base64,${arrayBufferToBase64(record.License.data.data)}`} ></img>
                
                {/* Add any other fields you want to display */}
            </div>
        ))}
</div>
    )
        
}
export default ViewReqPharmDoc;