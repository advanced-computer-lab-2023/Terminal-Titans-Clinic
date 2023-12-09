// Assuming the file names and component names follow the uppercase convention
import React from "react";
import DoctorHome from "../components/DoctorHome";
import DoctorNav from "../components/doctorNavBar.jsx"; // Corrected the import

function Doctor() {
    return (
        <>
            <DoctorNav />
            <DoctorHome />
        </>
    );
}

export default Doctor;