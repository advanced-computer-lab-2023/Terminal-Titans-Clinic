// Assuming the file names and component names follow the uppercase convention
import React from "react";
import DoctorHome from "../components/DoctorHome";
import {DoctorNavBar} from "../components/doctorNavBar.jsx"; // Corrected the import

function Doctor() {
    return (
        <>
            <DoctorNavBar />
            <DoctorHome />
        </>
    );
}

export default Doctor;