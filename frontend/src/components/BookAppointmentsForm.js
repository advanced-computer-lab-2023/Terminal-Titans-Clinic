import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import "../Styles/Appointments.css"

function BookAppointmentsForm() {
    const [blogs, setBlogs] = useState([]);

    const allAppointments = async () => {
        await axios.get(`http://localhost:8000/getDoctorAvailableSlots`).then(
            (res) => {
                const blogs = res.data;
                console.log(blogs);
                setBlogs(blogs);
            }
        );
    };

    useEffect(() => {
        allAppointments();
    }, []);

    const renderDays = () => {
        const days = [
            { name: "Friday", date: "August 23" },
            { name: "Saturday", date: "August 24" },
            { name: "Sunday", date: "August 25" },
            { name: "Monday", date: "August 26" },
            { name: "Tuesday", date: "August 27" },
        ];

        return days.map((day) => {
            const slots = blogs.filter((blog) => blog.day === day.name);

            return (
                <div className="day">
                    <div className="datelabel">
                        <strong>{day.name}</strong>
                        <br />
                        {day.date}
                    </div>
                    {slots.map((slot) => (
                        <div className="timeslot">{slot.time}</div>
                    ))}
                </div>
            );
        });
    };

    return (
        <div style={{ height: "280px", width: "700px", overflow: "scroll", border: "1px solid #ddd" }}>
            <div className="days">{renderDays()}</div>
        </div>
    );
}

//     return(
//     <div style="height:280px; width: 700px;overflow:scroll;border: 1px solid #ddd;">
//     <div class="days">
//     <div class="day">
//       <div class="datelabel"><strong>Friday</strong><br/>August 23</div>
//       <div class="timeslot">9:00am</div>
//       <div class="timeslot">9:30am</div>
//       <div class="timeslot">10:00am</div>
//     </div>
//     <div class="day">
//       <div class="datelabel"><strong>Saturday</strong><br/>August 24</div>
//       <div class="timeslot">10:30pm</div>
//     </div>  
//     <div class="day">
//       <div class="datelabel"><strong>Sunday</strong><br/>August 25</div>
//       <div class="timeslot">10:30pm</div>
//     </div>
//     <div class="day">
//       <div class="datelabel"><strong>Monday</strong><br/>August 26</div>
//       <div class="timeslot">10:30pm</div>
//     </div>
//     <div class="day">
//       <div class="datelabel"><strong>Tuesday</strong><br/>August 27</div>
//       <div class="timeslot">10:30pm</div>
//     </div>
//     </div>
//   </div>
//     )
// }

export default BookAppointmentsForm;
