
import Button from 'react-bootstrap/Button';
import Nav from "../components/Navbar-Pharmacist"
import Tess from "../components/Addmed"
import Body from '../components/PharmScreenBody';

function pharmacistScreen() {
    return (
    <div>
       <Nav/>
       <Body/>
        <Tess/>
    </div>   
        
    )
}
export default pharmacistScreen;