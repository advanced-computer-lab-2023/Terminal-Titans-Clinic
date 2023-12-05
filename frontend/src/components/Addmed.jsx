import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';



export default function Addmed() {
 
  
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      // Call your function to submit the data
      await submitMedicine(event);
    }
    setValidated(true);
  };

  const submitMedicine = async (event) => {
    
    
      event.preventDefault();
      const name = document.getElementsByName("Name")[0]?.value;
      const price = document.getElementsByName("Price")[0]?.value;
      const quantity = document.getElementsByName("Quantity")[0]?.value;
      const activeIngredients = document.getElementsByName("ActiveIngredients")[0]?.value;
      const medicalUse = document.getElementsByName("MedicalUse")[0]?.value;
      const overTheCounter = document.getElementsByName("overTheCounter")[0]?.value;
      const photo = document.getElementsByName("photo")[0]?.files[0];
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Price", price);
      formData.append("Quantity", quantity);
      formData.append("ActiveIngredients", activeIngredients);
      formData.append("MedicalUse", medicalUse);
      formData.append("OverTheCounter", overTheCounter);
      formData.append("photo", photo);
      await fetch("http://localhost:8000/Pharma/addMedicine", {
          method: "POST",
          body: formData
          , headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem("token")
          }
      }).then(res => res.json()).then(data => {
          alert(data.Result)
          console.log(data.Result);
      }).catch((err) => {
          console.log(err);
          alert(err);
      }
      )
  
  }
    
  const [validated, setValidated] = useState(false);

  

  const divStyles = {
    boxShadow: '1px 2px 9px #111',
    margin: '4em',
    padding: '1em',
  };
  return (
    
    
    <Form noValidate validated={validated} style={divStyles}  >
      <Row className='mb-3'>
        <h2>Add a new medicine</h2>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Medicine Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Medicine Name"
            name="Name"
          />
          <Form.Control.Feedback type="invalid">
              Please enter the medicine name
            </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Price</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Price"
            name="Price"
            min={0}
          />
      
          <Form.Control.Feedback type="invalid">
              Please enter the price
            </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>Quantity</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="number"
              name="Quantity"
              placeholder="Quantity"
              aria-describedby="inputGroupPrepend"
              required
              min={0}
            />
            <Form.Control.Feedback type="invalid">
              Please enter the quantity.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Active Ingredients</Form.Label>
          <Form.Control type="text"
           placeholder="Please enter in ingredient1 , ingredient2 format" 
           required 
           name="ActiveIngredients"
           />
          <Form.Control.Feedback type="invalid">
            Please provide the active ingredients
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>Medical Use</Form.Label>
          <Form.Control type="text" placeholder="Medical use" 
          required
          name="MedicalUse"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid medical use.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Type</Form.Label>
          <Form.Select aria-label="Default select example" name="overTheCounter" id="overTheCounter">
      <option value="false">Prescription based</option>
      <option value="true">Over The Counter</option>
    </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please provide a Type.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group></Form.Group>
      </Row>
     <Row className="mb-3">
      <Form.Group as={Col} md="4" controlId="formFile" className="mb-4">
        <Form.Label>Medicine image</Form.Label>
        <Form.Control type="file" name= "photo"/>
        <Form.Control.Feedback type="invalid">
            Please provide a Type.
          </Form.Control.Feedback>
      </Form.Group>
     </Row>
      <Button type="submit" onClick={handleSubmit}>Submit form</Button>
    </Form>
  );
}
