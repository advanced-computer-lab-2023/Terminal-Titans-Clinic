import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { useCart } from './CartContext';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import validator from 'validator';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
const Navbar1 = ({ click, onSearch, onFilter }) => {
  const { cartItems } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [medicalUses, setMedicalUses] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchedMedicines, setSearchedMedicines] = useState([]); // Updated variable name
  const [filteredAndSearchedMedicines, setFilteredAndSearchedMedicines] = useState([]);

  const signoutButtonFunc = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/Health-Plus';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartResponse = await axios.get('http://localhost:8000/Doctor/cartItemCount', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
        if (cartResponse.status === 200) {
          setCartItemCount(cartResponse.data.itemCount);
        } else {
          console.error('Failed to get cart item count. Unexpected response:', cartResponse);
        }

        const medicalUsesResponse = await axios.get('http://localhost:8000/Doctor/getAllMedicalUses', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
        if (medicalUsesResponse.status === 200) {
          setMedicalUses(medicalUsesResponse.data.medicalUses);
        } else {
          console.error('Failed to get medical uses. Unexpected response:', medicalUsesResponse);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch initially
    fetchData();

    // Poll for updates every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Runs once on mount

  return (
    
    <Navbar key={'xl'} expand={'xl'} className="bg-body-tertiary mb-3">
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <Container fluid>
        <Navbar.Brand href="/patient">Titans Pharmacy</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${'xl'}`} />
       {/* <InputGroup className="mb-3">
        <Form.Control
          id="searchInput"
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
        />
        <Button variant="outline-success" onClick={handleSearch}>
          Search
        </Button>
  </InputGroup>*/}
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${'xl'}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${'xl'}`}
          placement="end"
        >
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link href="/cart">
              <Button variant="primary">
                Cart <Badge bg="secondary">{cartItemCount}</Badge>
              </Button>
            </Nav.Link>
    
            <Nav.Link href="/orderDetails">
              <Button variant="light">
                Order
              </Button>
            </Nav.Link>

            <Nav.Link href="/patient">
              <Button variant="light">
                Store
              </Button>
            </Nav.Link>
            <Nav.Link href="/patient">
              <Button variant="light">
                undo searches
              </Button>
            </Nav.Link>
            {/*<Nav.Link href="/orderDetails">Order</Nav.Link>
            <Nav.Link href="/patient">Store</Nav.Link>
            <NavDropdown title="Filter" id="basic-nav-dropdown">
              {medicalUses.map((use, index) => (
                <NavDropdown.Item key={index} onClick={() => handleMedicalUseFilter(use)}>
                  {use}
                </NavDropdown.Item>
              ))}
              </NavDropdown>*/}

            {/* Display filtered medicines */}

            <Nav.Link><Button variant="light" onClick={() => setModalShow(true)}>Change Password</Button></Nav.Link>
            <Nav.Link>
              <Button variant="danger" onClick={signoutButtonFunc}>Sign Out</Button>
            </Nav.Link>
          </Nav>
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
        <h4>Enter your new Password</h4>
        <label htmlFor="oldPassword">old Password:</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setoldPassword(e.target.value)}></input>

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => validatePass(e.target.value)}></input> <br />
        {errorMessagePass && <p>{errorMessagePass}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button variant="success" onClick={changePassword} disabled={errorMessagePass !== 'Is Strong Password'}>Update Password</Button>
      </Modal.Footer>
    </Modal>
  );
}
