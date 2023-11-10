import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterPatient from "./Pages/RegisterPatient";
import RegisterDoctor from "./Pages/RegisterDoctor";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/login";
import ForgotPassword from "./Pages/ForgotPassword";
import Button from 'react-bootstrap/Button';
import BookAppointments from "./Pages/BookAppointments";

function App() {

  const signoutButtonFunc = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/';
  }



  return (
    <div className="App">
      {
        window.location.pathname == '/Health-Plus' || window.location.pathname == '/Health-Plus/registerPatient' || window.location.pathname == '/Health-Plus/registerDoctor'?
          <></>
          : <div className="signoutButton">
            <Button variant="danger" onClick={signoutButtonFunc}>Sign Out</Button>
          </div>
      }

      <Router basename="/Health-Plus">

        <Routes>

          <Route path="/registerPatient" element={<RegisterPatient />} />
          <Route path="/registerDoctor" element={<RegisterDoctor />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/bookAppointments" element={<BookAppointments/>} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
