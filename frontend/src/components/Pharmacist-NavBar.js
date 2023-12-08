import './Navbar.css';
// export default Navbar;
import React, { useState, useEffect } from 'react';
import validator from 'validator'
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import { useCart } from '../Components/CartContext'; // Import the useCart hook
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/esm/Row';
// import * as formik from 'formik';
// import * as yup from 'yup';
import InputGroup from 'react-bootstrap/InputGroup';

const Navbar1 = ({ click }) => {
  // const { cartItems } = useCart();
  // const [cartItemCount, setCartItemCount] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);


  const signoutButtonFunc = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/Health-Plus';
  }

  const SignoutDanger=()=>{
  
  }

  return (
    <Navbar key={'xl'} expand={'xl'} className="bg-body-tertiary mb-3">
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Container fluid>
        <Navbar.Brand href="/Health-Plus/pharmacistScreen" style={{fontSize:'20px'}}>Titans Pharmacy</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${'xl'}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${'xl'}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${'xl'}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${'xl'}`}>
              Titans Pharmacy
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
            <NavDropdown title="Medicines" id="collapsible-nav-dropdown" className='align-self-center justify-self-center me-3' style={{
              fontSize: '20px'
            }}>
              <NavDropdown.Item href="/Health-Plus/AvailableMeds">Available Medicines</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/Health-Plus/NewMed">
                Add a new medicine
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link className='me-3' style={{fontSize:'20px'}}> Chat</Nav.Link>
            <Nav.Link className='me-3' href='/NewMed' style={{fontSize:'20px'}}> Reports</Nav.Link>

            <NavDropdown title="Profile" id="collapsible-nav-dropdown" className='align-self-center me-5' style={{
              fontSize: '20px'
            }}>
              <NavDropdown.Item variant="light" onClick={() => setModalShow(true)}>Change Password</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={signoutButtonFunc} className="signout">
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
            

              {/* <Nav.Link href="/cart">
                <Button variant="primary">
                  Cart <Badge bg="secondary">{cartItemCount}</Badge>
                </Button>
              </Nav.Link> */}


              {/* <Nav.Link href="/orderDetails">Order</Nav.Link> */}
              
              {/* <Nav.Link href="/patient">Store</Nav.Link> */}
              {/* <Nav.Link><Button variant="light" onClick={() => setModalShow(true)}>Change Password</Button></Nav.Link>
              <Nav.Link>
                <Button variant="danger" onClick={signoutButtonFunc}>Sign Out</Button>
              </Nav.Link> */}
            
            </Nav>
      
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Navbar1;

function MyVerticallyCenteredModal(props) {
  const [oldPassword, setoldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessagePass, setErrorMessagePass] = useState('')
  const [validated, setValidated] = useState(false);
  

  const validatePass = (value) => {
    setPassword(value);
    if (value !== '' && validator.isStrongPassword(value, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 0
    })) {
      setErrorMessagePass('Is Strong Password')
    } else {
      setErrorMessagePass('Password has to be 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number ')
    }
  }



  const changePassword = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { password, oldPassword };

    fetch('http://localhost:8000/security/changePassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem("token") },
      body: JSON.stringify(data),
    }).then((response) => response.json()).then(data => {
      console.log(data);
      if (data.success) {
        alert("Password Changed Successfully")
        sessionStorage.removeItem('token');
        window.location.href = '/Health-Plus';
      }
      else {
        alert(data.message)
      }
    })
      .catch((error) => {

        console.error('Error:', error);
        alert(error.response.data.message)

      });
    // Make a POST request to your backend register route


  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Change Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}></Form>
       {/* <Row className='mb-3'> <h4>Enter your new Password</h4></Row> */}
       <Row > 
        {/* <Form.Label>Old Password</Form.Label>  */}
       <Form.Group as={Col} md="10" controlId="validationCustom01">
          <Form.Label>Old Password</Form.Label>
          <InputGroup>  <Form.Control
            size='md'
            required
            type="password"
            value={oldPassword}
            onChange={(e) => setoldPassword(e.target.value)}
            placeholder="Old Password"
          />
          <Form.Control.Feedback type="invalid">
              Please enter the Password
            </Form.Control.Feedback> 
             </InputGroup>
        </Form.Group>
        {/* <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group> */}
       </Row>
        {/* <label htmlFor="oldPassword">old Password:</label> */}
        {/* <input
          type="password"
          value={oldPassword}
          onChange={(e) => setoldPassword(e.target.value)}></input> */}

        {/* <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => validatePass(e.target.value)}></input> <br />
        {errorMessagePass === '' ? null :
          <h5 style={{
            color: 'red',
          }}>{errorMessagePass}</h5>} */}
<br />
        <Row> 
        {/* <Form.Label>Old Password</Form.Label>  */}
       <Form.Group as={Col} md="10" controlId="validationCustom01">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            required
            size='md'
            type="password"
            value={password}
            onChange={(e) => validatePass(e.target.value)}
            placeholder="New Password"
          />
          <Form.Control.Feedback type="invalid">
              Please enter the Password
            </Form.Control.Feedback>
        </Form.Group>
       </Row>

        <br />
      </Modal.Body>
      <Modal.Footer className='align-self-center'>
        <Button variant='outline-dark' onClick={changePassword}>Submit</Button>
        {/* <Button onClick={props.onHide}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
}