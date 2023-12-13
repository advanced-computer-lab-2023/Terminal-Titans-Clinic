import React from "react";
import AptmntsList from "../components/AptmntsList";
import {PatientNavBar} from "../components/PatientNavBar";

function ViewAppointments() {

  return (
    <>
      <PatientNavBar/>
      <AptmntsList />
    </>);
}

export default ViewAppointments;