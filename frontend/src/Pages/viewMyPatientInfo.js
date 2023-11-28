import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ViewMyPatientBasicInfo from "../components/viewMyPatientBasicInfo";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ViewMyPatientMedHistory from '../components/viewMyPatientMedHistory';
import ViewMyPatientHealthRec from '../components/viewMyPatientHealthRecords';


function ViewPatInfo() {

    return (
        <Tabs
            defaultActiveKey="basicInfo"
            id="uncontrolled-tab-example"
            className="mb-3 d-flex justify-content-center"
            transition={true}
        >
            <Tab eventKey="basicInfo" title="Basic Info">
                <ViewMyPatientBasicInfo />
            </Tab>
            <Tab eventKey="medicalHistory" title="Medical History">
                <ViewMyPatientMedHistory/>
            </Tab>
            <Tab eventKey="healthRec" title="Health Records">
                <ViewMyPatientHealthRec/>
            </Tab>
            <Tab eventKey="prescriptions" title="Prescriptions">
            </Tab>
        </Tabs>
    );
}


  
export default ViewPatInfo;