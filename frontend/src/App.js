import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterPatient from "./Pages/RegisterPatient";
import RegisterDoctor from "./Pages/RegisterDoctor";


function App() {
  return (
    <div className="App">
      <Router basename="/Health-Plus">
        <Routes>
       
          <Route path="/registerPatient" element={<RegisterPatient />} />
          <Route path="/registerDoctor" element={<RegisterDoctor/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
