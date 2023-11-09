import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterPatient from "./Pages/RegisterPatient";
import RegisterDoctor from "./Pages/RegisterDoctor";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/login";


function App() {
  return (
    <div className="App">
      <Router basename="/Health-Plus">
        <Routes>
       
          <Route path="/registerPatient" element={<RegisterPatient />} />
          <Route path="/registerDoctor" element={<RegisterDoctor/>} />
          <Route path="/" element={<Login/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
