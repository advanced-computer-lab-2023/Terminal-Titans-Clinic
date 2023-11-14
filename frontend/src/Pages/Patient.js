import React from "react";
import PatientHome from "../components/PatientHome";
import ViewandDeleteHistory from "../components/ViewandDeleteHistory";


function Patient() {
    return (
        <div>
            <PatientHome />
            <ViewandDeleteHistory />
        </div>
    );
}
export default Patient;