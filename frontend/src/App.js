import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Pages/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import ForgotPassword from "./Pages/ForgotPassword";
import Button from 'react-bootstrap/Button';
import BookAppointments from "./Pages/BookAppointments";
import ChangePasswordForm from "./components/ChangePasswordForm";
import Payment from "./Pages/Payment";
import ViewAppointments from "./Pages/ViewAppoitments";
import SignIn from "./Pages/SignIn";
import HealthPackages from "./Pages/HealthPackages";
import ViewmyHealthRecords from "./components/viewHealthRecords";
import ViewmyPatientsHealthRecords from "./components/viewMyPatientHealthRecords";
import DocViewAppointments from "./Pages/DocViewAppointments";
import Patient from "./Pages/Patient";
import Doctor from "./Pages/Doctor";
import AddRegFamMem from "./components/addRegFamilymember";
import AdminPage from "./Pages/AdminPage";
import SubPackage from "./Pages/packageSubscribtion";
import EmploymentContract from "./Pages/EmploymentContract";
import ConfirmPayment from "./Pages/ConfrimPaymentComponent";
import ViewRegDocDoc from "./components/viewRegDocDoc";


import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState } from 'react';

function App() {

  const signoutButtonFunc = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/Health-Plus';
  }



  return (
    <div className="App">
      {
        window.location.pathname == '/Health-Plus' || window.location.pathname == '/Health-Plus/registerPatient' || window.location.pathname == '/Health-Plus/registerDoctor' ?
          <></>
          : <div className="signoutButton">
            <Button variant="danger" onClick={signoutButtonFunc}>Sign Out</Button>
          </div>
      }

      <Router basename="/Health-Plus">

        <Routes>

          <Route path="/admin" element={<AdminPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/patientHome" element={<Patient />} />
          <Route path="/doctorHome" element={<Doctor />} />
          <Route path="/bookAppointments" element={<BookAppointments />} />
          <Route path="/viewAppointments" element={<ViewAppointments />} />
          <Route path="/docViewAppointments" element={<DocViewAppointments />} />
          <Route path="/changePassword" element={<ChangePasswordForm />} />
          <Route path="/healthPackages" element={<HealthPackages />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/viewHealthRecords" element={<ViewmyHealthRecords />} />
          <Route path="/viewMyPatientHealthRecords" element={<ViewmyPatientsHealthRecords />} />
          <Route path="/addRegFamilymember" element={<AddRegFamMem />} />
          <Route path="/packageSubscribtion" element={<SubPackage />} />
          <Route path="/EmploymentContract" element={<EmploymentContract />} />
          <Route path="/viewRegDocDoc" element={<ViewRegDocDoc/>} />
          <Route path="/confirmPayment" element={<ConfirmPayment/>} />
          <Route path="/" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
