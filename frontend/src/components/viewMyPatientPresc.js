import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profileImage from "../Assets/profile.png";
function ViewMyPatientPresc(){
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('Id');
    const [myPatient, setMyPatient] = useState({});

}
export default ViewMyPatientPresc;
