import React, { useEffect } from "react";
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
import DoctorsList from "./Pages/viewDoctors"
import ViewPatInfo from "./Pages/viewMyPatientInfo";
import ViewDocProfile from "./Pages/DocProfilePage";
import ViewMyProfile from "./Pages/viewMyProfile";
import DocAppointmentDetails from "./Pages/DocAppointmentDetails";
import AddAvailableSlots from "./Pages/AddAvailableSlots";
import AdminUserPage from "./components/AdminUserPage";
import AppointmentCheckout from "./Pages/AppointmentCheckout";
import PatientRecord from "./components/PatientRecord";
import AddPresc from "./Pages/AddPresc";
import PackageCheckout from "./Pages/PackageCheckout";
import FamilyMember from "./components/FamMember";
import ViewDoctorInfo from "./Pages/viewDoctorInfo.js";
import ReschduleDoc from "./Pages/rescheduleDoc.js";
import FollowUpDoc from "./Pages/followUpDoc.js";import Notification from "./components/Notification";



import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState } from 'react';
import Room from './components/Room';
import Chat from './components/Chat';
import MedsPage from "./Pages/MedsPage";
import ShowAvailableSlots from "./Pages/ShowAvailableSlots";
import NewMed from "./Pages/newmedPage";
import AvailableMeds from './Pages/AvailableMeds';
import MedPharm from './Pages/MedPagePharm.js'
import AcceptRejectFollowUp from "./Pages/DocFollowUpRequests.js";
import Reschdule from "./Pages/Reschedule.js";
import FollowUp from "./Pages/FollowUp.js";


function App() {

  return (
    <div className="App">


      <Router basename="/Health-Plus">

        <Routes>
          <Route path="/addPresc" element={<AddPresc />} />
          <Route path="/medicine" element={<MedsPage />} />
          <Route path="/medicine/:medicineId" element={<MedsPage />} />

          <Route path="/admin" element={<AdminHome />} />
          <Route path="/docApplicationList" element={<ViewDocApplications />} />
          <Route path="/manageUsers" element={<AdminUserPage />} />
          {/* <Route path="/admin" element={<AdminPage />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/patientHome" element={<PatientHome />} />
          <Route path="/doctorHome" element={<Doctor />} />
          <Route path="/notifications" element={<Notification />} />

          {/* PHARMACIST ROUTES */}
          <Route path="/pharmacistHome" element={<PharmacistScreen />} />
          <Route path="/NewMed" element={<NewMed />} />
          <Route path="/AvailableMeds" element={<AvailableMeds />} />
          <Route path="/medicinepharm" element={<MedPharm />} />


          <Route path="/bookAppointments" element={<BookAppointments />} />
          <Route path="/viewAppointments" element={<ViewAppointments />} />
          <Route path="/changePassword" element={<ChangePasswordForm />} />
          <Route path="/healthPackages" element={<HealthPackages />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/addRegFamilymember" element={<AddRegFamMem />} />
          <Route path="/packageSubscribtion" element={<SubPackage />} />
          <Route path="/viewRegDocDoc" element={<ViewRegDocDoc />} />
          <Route path="/adminPharm" element={<AdminPharmPage />} />
          <Route path="/meeting" element={<Room />} />
          <Route path="/chat/:token" element={<Chat />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/viewMyProfile/:id" element={<ViewMyProfile />} />
          <Route path="/appointmentCheckout" element={<AppointmentCheckout />} />
          <Route path="/patientRecord" element={<PatientRecord />} />
          <Route path="/showAvailableSlots" element={<ShowAvailableSlots />} />
          <Route path="/PackageCheckout" element={<PackageCheckout />} />
          <Route path="/FamilyMember" element={<FamilyMember />} />
          <Route path="/viewDoctors" element={<DoctorsList />} />
          <Route path="/ViewDoctorInfo" element={<ViewDoctorInfo />} />
          <Route path="/reschedule" element={<Reschdule />} />
          <Route path="/followUp" element={<FollowUp />} />
      {/* doctor Routes */}
          <Route path="/docViewAppointments" element={<DocViewAppointments />} />
          <Route path="/EmploymentContract" element={<EmploymentContract />} />
          <Route path="/viewMyPatientsList" element={<PatientList />} />
          <Route path="/viewMyPatientInfo" element={<ViewPatInfo />} />
          <Route path="/viewDocProfile/:id" element={<ViewDocProfile />} />
          <Route path='/docViewAppointmentsDetails' element={<DocAppointmentDetails />} />
          <Route path="/addAvailableSlots" element={<AddAvailableSlots />} />
          <Route path="/acceptRejectFollowUp" element={<AcceptRejectFollowUp />} />
          <Route path="/reschduleDoc" element={<ReschduleDoc />} />
          <Route path="/followUpDoc" element={<FollowUpDoc />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
