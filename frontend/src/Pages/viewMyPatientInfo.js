import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import RegisterDoctorForm from "../components/RegisterDoctorForm";
import RegisterPatientForm from "../components/RegisterPatientForm";
import RegisterPharmacistForm from "../components/RegisterPharmacistForm";
import { useParams } from 'react-router-dom';


function Register() {
    const params = useParams();
console.log(params);
    return (
        <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3 d-flex justify-content-center"
            transition={true}
        >
            <Tab eventKey="basicInfo" title="Basic Info">
                
            </Tab>
            <Tab eventKey="medicalHistory" title="Medical History">
            </Tab>
            <Tab eventKey="healthRec" title="Health Records">
            </Tab>
        </Tabs>
    );
}

export default Register;