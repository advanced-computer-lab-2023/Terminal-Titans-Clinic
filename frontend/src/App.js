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
import DocViewAppointments from "./Pages/DocViewAppointments";
import Patient from "./Pages/Patient";
import PatientHome from "./components/PatientHomePage";
import AdminHome from "./Pages/AdminHomePage";
import Doctor from "./Pages/Doctor";
import AddRegFamMem from "./components/addRegFamilymember";
import AdminPage from "./Pages/AdminPage";
import SubPackage from "./Pages/packageSubscribtion";
import EmploymentContract from "./Pages/EmploymentContract";
import ViewRegDocDoc from "./components/viewRegDocDoc";
import ViewDocApplications from "./components/ViewDocApplications";
import AdminPharmPage from "./Pages/AdminPharmPage";
import PharmacistScreen from "./Pages/pharmacistScreen";
import PatientList from "./Pages/viewMyPatientsList";
import ViewPatInfo from "./Pages/viewMyPatientInfo";
import ViewDocProfile from "./Pages/DocProfilePage";
import ViewMyProfile from "./Pages/viewMyProfile";
import DocAppointmentDetails from "./Pages/DocAppointmentDetails";
import AddAvailableSlots from "./Pages/AddAvailableSlots";
import AdminUserPage from "./components/AdminUserPage";
import AppointmentCheckout from "./Pages/AppointmentCheckout";
import PatientRecord from "./components/PatientRecord";



import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState } from 'react';
import Room from './components/Room';
import Chat from './components/Chat';

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

          <Route path="/admin" element={<AdminHome />} />
          <Route path="/docApplicationList" element={<ViewDocApplications />} />
          <Route path="/manageUsers" element={<AdminUserPage />} />
          {/* <Route path="/admin" element={<AdminPage />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/patientHome" element={<PatientHome />} />
          <Route path="/doctorHome" element={<Doctor />} />
          <Route path="/pharmacistHome" element={<PharmacistScreen/>}/>
          <Route path="/bookAppointments" element={<BookAppointments />} />
          <Route path="/viewAppointments" element={<ViewAppointments />} />
          <Route path="/docViewAppointments" element={<DocViewAppointments />} />
          <Route path="/changePassword" element={<ChangePasswordForm />} />
          <Route path="/healthPackages" element={<HealthPackages />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/addRegFamilymember" element={<AddRegFamMem />} />
          <Route path="/packageSubscribtion" element={<SubPackage />} />
          <Route path="/EmploymentContract" element={<EmploymentContract />} />
          <Route path="/viewRegDocDoc" element={<ViewRegDocDoc />} />
          <Route path="/adminPharm" element={<AdminPharmPage />} />
          <Route path="/viewMyPatientsList" element={<PatientList />} />
          <Route path="/viewMyPatientInfo" element={<ViewPatInfo />} />
          <Route path="/viewDocProfile" element={<ViewDocProfile />} />
          <Route path='/docViewAppointmentsDetails' element={<DocAppointmentDetails />} />
          <Route path="/meeting" element={<Room />} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/" element={<SignIn />} />
          <Route path="/viewMyProfile" element={<ViewMyProfile />} />
          <Route path="/addAvailableSlots" element={<AddAvailableSlots />} />
          <Route path="/appointmentCheckout" element={<AppointmentCheckout />} />
          <Route path="/patientRecord" element={<PatientRecord />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
