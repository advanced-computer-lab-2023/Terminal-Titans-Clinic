
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Appointments.css"

import moment from 'moment';

function BookAppointmentsForm() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [aptmnts,setAppointments] = useState([]);

    const allAppointments = async (doctorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/patient/getDoctorAvailableSlots/${doctorId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );
            const aptmnts = response.data;
                console.log(aptmnts);
                setAppointments(aptmnts.final)
        } catch (error) {
            console.error('Error fetching data:', error);
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
        console.log(aptmnts.final);
        const dates = [...new Set(aptmnts.map((aptmnt) => aptmnt.Date))];

        return dates.map((date) => {
            const slots = aptmnts.filter((aptmnt) => aptmnt.Date === date);
            //console.log( moment(date).format('HH:mm'));
            const twoHoursAgo = moment(date).subtract(2, 'hours');
            console.log(twoHoursAgo.format('HH:mm'));
            

            return (
                <div className="day">
                    <div className="slot-container">
                        <strong>{moment(date).format("dddd")}</strong>
                        <br />
                        {moment(date).format("MMMM D")}
                    </div>    
                    <div className="timeslot">{twoHoursAgo.format('HH:mm')}</div>
                </div>
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

    return (

        <div>
            <select value={selectedDoctor} onChange={handleDoctorChange}>
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor.Name}>
                        {doctor.Name}
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
