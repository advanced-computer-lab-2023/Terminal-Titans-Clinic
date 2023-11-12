import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import RegisterDoctorForm from "../components/RegisterDoctorForm";
import RegisterPatientForm from "../components/RegisterPatientForm";

function Register() {
    return (
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3 d-flex justify-content-center"
        >
          <Tab eventKey="home" title="Register Doctor">
            <RegisterDoctorForm />
          </Tab>
          <Tab eventKey="profile" title="Register Patient">
          {<RegisterPatientForm />}
          </Tab>
        </Tabs>
      );
}

export default Register;