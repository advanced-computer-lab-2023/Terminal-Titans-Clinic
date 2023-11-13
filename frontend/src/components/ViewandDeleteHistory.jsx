import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

// ----------------------------------------------------------------------

export default function ViewandDeleteHistory() {

    const [History, setHistory] = useState([]);

    // const acceptDoctor = async (username) => {
    //     await axios(
    //         {
    //             method: 'post',
    //             url: `http://localhost:8000/admin/Acceptance/${username}`,
    //             headers: {
    //                 Authorization: `Bearer ${sessionStorage.getItem('token')}`
    //             }
    //         }
    //     ).then((response) => {
    //         console.log(response);
    //         setDoctors(response.data.Result);
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    // }

    // const rejectDoctor = async (username) => {
    //     console.log(username);
    //     await axios(
    //         {
    //             method: 'delete',
    //             url: `http://localhost:8000/admin/Rejection/${username}`,
    //             headers: {
    //                 Authorization: `Bearer ${sessionStorage.getItem('token')}`
    //             }
    //         }
    //     ).then((response) => {
    //         console.log(response);
    //         setDoctors(response.data.Result);
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    // }

    // const getDoctors = async () => {
    //     await axios(
    //         {
    //             method: 'get',
    //             url: 'http://localhost:8000/admin/fetchReqDoctors',
    //             headers: {
    //                 Authorization: `Bearer ${sessionStorage.getItem('token')}`
    //             }
    //         }
    //     ).then((response) => {
    //         console.log(response);
    //         setDoctors(response.data.users);
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    // }


    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
      
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
      
        return btoa(binary);
      }

    const getHistory = async () => {
       const response= await axios(
            {
                method: 'get',
                url: 'http://localhost:8000/patient/viewMedicalHistory',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response +"RESPONSEEEE");
            setHistory(response);
        }).catch((error) => {
            alert("No History Found");
            console.log(error);
        });
    }


    useEffect(() => {
        getHistory();
    }, []);

    return (
        <div></div>
        // <Table striped bordered hover>
        //     <thead>
        //         <tr>
        //             <th>index</th>
        //             <th>image</th>
        //             <th>file name</th>
        //             <th>delete</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {History.map((histo, index) => (
        //             <tr>
        //                 <React.Fragment key={index}>
        //                     <td>{index + 1}</td>
        //                     <td>
        //                     {History.map((record, index) => (
        //                 <div key={index}>
        //                     <h3>Record {index + 1}</h3>
        //                  {/* {console.log(record)}    */}
        //                  <img
        //                   src={`data:image/jpeg;base64,${arrayBufferToBase64(histo.data.data)}`}
                          
        //               />
        //                 </div> 
        //                    ))}       
        //                         </td>
        //                     <td>{histo.name}</td>
        //                     {/* <td><button type="button" className="btn btn-success" onClick={(event) => { acceptDoctor(doctor.Username) }}>Accept</button></td> */}
        //                     <td><button type="button" className="btn btn-danger">Reject</button></td>
        //                 </React.Fragment>
        //             </tr>
        //         ))}
        //     </tbody>
        // </Table >
    );
}