import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterPatient from "./Pages/RegisterPatient";


function App() {
  return (
    <div className="App">
      <Router basename="/Health-Plus">
        <Routes>
       
          <Route path="/registerPatient" element={<RegisterPatient />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
