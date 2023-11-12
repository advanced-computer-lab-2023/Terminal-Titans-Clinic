
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Appointments.css"

import moment from 'moment';
import { set } from 'mongoose';

function BookAppointmentsForm() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [aptmnts,setAppointments] = useState([]);
    const [unRegFamily,setUnRegFamily] = useState([]);
    const [famMemId,setFamMemId] = useState(null);
    const [selectedFam,setSelectedFam] = useState('');
    const [selectedDate,setSelectedDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            console.log(sessionStorage.getItem("token") )
            try {
                const response = await axios.get(`http://localhost:8000/patient/viewRegFamMem`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
                );
                const data = response.data;
                   // console.log(aptmnts);
                  setUnRegFamily(data.Result.unregistered)
                     console.log(data.Result)
            } catch (error) {
                console.error('Error fetching data:', error);
                alert(error.response.data.message)
            }
        };
      
        fetchData();
    }, []);
    const allAppointments = async (doctorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/patient/getDoctorAvailableSlots/${doctorId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            const aptmnts = response.data;
                console.log(aptmnts);
                setAppointments(aptmnts.final)
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('cant find available slots')

        }
    };

    

    const getDoctors = async () => {
            const response = await axios.post(
                `http://localhost:8000/patient/getDoctors`,
                {  },
                { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            if (response.status === 200) {
                const doctors = response.data;
                console.log(doctors.Doctors);
                setDoctors(doctors.Doctors);

            }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    const renderDays = () => {
        //console.log(aptmnts.final);
        const dates = [...new Set(aptmnts.map((aptmnt) => aptmnt.Date))];

        return dates.map((date) => {
            const slots = aptmnts.filter((aptmnt) => aptmnt.Date === date);
            //console.log( moment(date).format('HH:mm'));
            const twoHoursAgo = moment(date).subtract(2, 'hours');
           
            //console.log(date)
            return (
                <div className="day">
                    <div className="slot-container">
                        <strong>{moment(date).format("dddd")}</strong>
                        <br />
                        {moment(date).format("MMMM D")}
                    </div>    
                    <div className="timeslot" onClick={async() => {
                        setSelectedDate(date);
                        bookAppointment(date)
    }} value={date}>
        {twoHoursAgo.format('HH:mm')}
    </div>                </div>
            );
        });
    }
    

    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
        
        const selectedOption = event.target.options[event.target.selectedIndex];
        // let doctorId = selectedOption.id;
        // console.log('handleDoctorChange', doctorId, selectedOption.text);
        // console.log(event.target.selectedIndex);
        // console.log(doctors[(event.target.selectedIndex)-1]._id);
        // const selectedOptionKey = selectedOption.key;
        
        // const selectedDoctorId = doctors.find(
        //     (doctor) => doctor.name === event.target.value
        // )._id;

        allAppointments(doctors[(event.target.selectedIndex)-1]._id);
    };
    const handleFamilyChange = (event) => {
        setSelectedFam(event.target.value);
        if(event.target.value !== 'myself')
        setFamMemId(unRegFamily[(event.target.selectedIndex)-1]._id);
        else
        setFamMemId(null);
        
    };
    const bookAppointment = async (date) => {
        const response = await axios.post(
            `http://localhost:8000/patient/bookAppointment`,
            { dId: selectedDoctor, date: date, famId: famMemId},
            { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
    }

    return (

        <div>
            <select value={selectedDoctor} onChange={handleDoctorChange}>
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                        {doctor.Name}
                    </option>
                ))}
            </select>
            <label>Patient:</label>
            <select value={selectedFam} onChange={handleFamilyChange}>
                <option value='myself'>myslef</option>
                {unRegFamily.map((famMem) => (
                    <option key={famMem._id} value={famMem.Name}>
                        {famMem.Name}
                    </option>
                ))}
            </select>
            <div
                style={{
                    height: "280px",
                    width: "700px",
                    overflow: "scroll",
                    border: "1px solid #ddd",
                }}
            >
                <div className="days">{renderDays()}</div>
            </div>
        </div>
    );
}
export default BookAppointmentsForm;
