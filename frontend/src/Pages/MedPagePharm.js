// export default Meds2;
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './Meds.css';
import PharmNav from '../components/Pharmacist-NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import './PharmMedView.css';
import { useNavigate, createSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';
// import { useParams } from 'react-router-dom';


function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}


function Meds2() {
    // const location = useLocation();
    const [medicines, setMedicines] = useState([]);
    const location = useLocation();
    const _id = location.state.medicineId;
    // const { medicineId } = useParams();
   
    // const _id = new URLSearchParams(location.search).get('medicineId');
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [editmode, setEditMode]=useState(false);
    const [controls, setControls] = useState([{ key: 1 , value:'' }]);
    const [addedControls, setAddedControls] = useState([]);
    var concatenatedString ="";
    var initialControls=[];
    
    

    
    useEffect(() => {
        
        console.log("Edit "+editmode);
        
        console.log('_id:', _id);

        const fetchMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:8000/Pharma/getAllMedicines', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
                );
                const jsonData = response.data.meds;
                console.log(response);
                setMedicines(jsonData);
              
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMedicines();
        
    }, [location.search]);
    

    if (!medicines || medicines.length === 0) {
        return <div>Loading or no data available.</div>;
    }

    const findMedicineById = (medicines, _id) => {
        for (let i = 0; i < medicines.length; i++) {
            if (medicines[i]._id === _id) {
                console.log(medicines[i].ActiveIngredients)
                initialControls=medicines[i].ActiveIngredients;
                return medicines[i];
            }
        }

        return null;
    };
    
    
    const setInitialControl=()=>{
        const initialControls = medicine.ActiveIngredients.map((ingredient, index) => ({
            key: index + 1,
            value: ingredient,
          }));
          setControls(initialControls);
    }


    const medicine = findMedicineById(medicines, _id);
    concatenatedString = medicine.ActiveIngredients.map((ActiveIng) => `${ActiveIng}`).join(',');
    console.log("Concatenated String:  "+concatenatedString)
    
   
    

    if (!medicine) {
        return <div>Medicine not found</div>;
    }

    

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        setSelectedQuantity(newQuantity);
    };
    const editmodeOn=()=>{
        setEditMode(true);
    }
    const editmodeOff=()=>{
        setEditMode(false);
    }

    
    const handleAddControl = () => {
        const newKey = controls.length + 1;
        setControls([...controls, { key: newKey, value: '' }]);
      };
    
      const handleRemoveControl = (keyToRemove) => {
        if (controls.length > 1) {
          const updatedControls = controls.filter((control) => control.key !== keyToRemove);
          setControls(updatedControls);
        }
      };
    
      const handleChange = (key, event) => {
        const updatedControls = controls.map((control) =>
          control.key === key ? { ...control, value: event.target.value } : control
        );
        setControls(updatedControls);
        console.log("CONTROLS:"+ controls )
        //  concatenatedString = updatedControls.map((item, index) => ` ${item.value}`).join(', ');
        // console.log(concatenatedString);
            
        
      };
      const editMedicine = async (event) => {
        // console.log("MED ID "+ _id);
        // console.log("NAME"+document.getElementById("medicineName")?.textContent.toLowerCase())
        // console.log("PRICE"+document.getElementsByName("newPrice")[0]?.value)
        // console.log("QUANTITY"+document.getElementsByName("newQuantity")[0]?.value)
        // console.log("ACTIVE ING"+document.getElementsByName("newIngredients")[0]?.value)
        // console.log("OVER THE COUNTER"+document.getElementsByName("overTheCounter")[0]?.value)
        // console.log("archiveStatus"+ document.getElementsByName("archiveStatus")[0]?.value)
        const Name = document.getElementById("medicineName")?.textContent;
        console.log(Name)
        const Price = document.getElementsByName("newPrice")[0]?.value;
        console.log(Price)
        const Quantity = document.getElementsByName("newQuantity")[0]?.value;
        console.log(Quantity)
        const ActiveIngredients = document.getElementsByName("newIngredients")[0]?.value;
        console.log(ActiveIngredients)
        const OverTheCounter = document.getElementsByName("overTheCounter")[0]?.value;
        console.log(OverTheCounter)
        const Archived = document.getElementsByName("archiveStatus")[0]?.value;
        console.log(Archived)
        const data= {_id,Name,Price,Quantity,ActiveIngredients,OverTheCounter,Archived}
        console.log(data)
        // const formData = new FormData();
        // formData.append("_id",_id);
        // formData.append("Name", name);
        // formData.append("Price", price);
        // formData.append("Quantity", quantity);
        // formData.append("ActiveIngredients", activeIngredients);
        // formData.append("OverTheCounter", overTheCounter);
        // formData.append("Archived", archiveStatus);
        // console.log(formData.append.arguments)
        await fetch("http://localhost:8000/Pharma/editMedicine", {
            method: "PUT",

             headers: { 
                    'Content-Type': 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem("token")
            },
            // headers:{
            
            // },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            editmodeOff();
            alert("You have successfuly edited the medicine")
            window.location.reload();
            console.log(data.Result);
        }).catch((err) => {
            console.log(err);
            alert(err);
        }
        )
    
    }

    const divStyles = {
        boxShadow: '1px 2px 9px #666',
        margin: '4em',
        padding: '1em',
        margin: 'auto',
        borderRadius:'10px'
      };
    return (
        (!editmode?<div> 
            
            <PharmNav/>

            <Container style={divStyles} >
                <Row sm={12} md={9} lg={9}>
                <Link to={`/AvailableMeds`}>
                        <Button variant='outline-dark'>Back</Button>
                      </Link> 
                    
                </Row>
      <Row sm={12} md={9} lg={9}>
        <Col sm={12} md={12} lg={6}>
        <div className="left_img">
                {medicine.Picture && medicine.Picture.data && medicine.Picture.contentType && (
                    <div className="imagesize"> 
                     <img
                    src={`data:${medicine.Picture.contentType};base64,${arrayBufferToBase64(
                        medicine.Picture.data.data
                    )}`}
                    alt={medicine.Name}
                /></div>
                  
                )}
            </div>
            <Row>
                <div className='editsectionMdLg' style={{
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "center",

                }}>
                    <Col sm={0} >
                    {/* <Form.Check // prettier-ignore
                        type="switch"
                        id="custom-switch"
                        label="Check this switch"
                        /> */}
                       
                       <Button variant="outline-dark" 
                       className='my-5'
                       style={{
                        width:"30vw", 
                        margin: "0 auto", 
                        textAlign: "center",
                        alignItems:"center",
                        justifyContent: "center",
                        display: "flex"}}
                            onClick={editmodeOn}
                           >Edit</Button>
                    </Col>
                </div>
          
        </Row>
        </Col>
        <Col sm={12} md={12} lg={6}>
        <div className="left_info">
                <p className="left_name" >
                {medicine.Name}
                </p>
                <p>Price: ${medicine.Price}</p>
                <p> Active Ingredients: <span>
                    {/* {medicine.ActiveIngredient.map((ingredient)=> ))} */}
                    {concatenatedString}</span></p>
                <p>Medical use: {medicine.MedicalUse.join(' ')}</p>
                <p>  Quantity: <span>{medicine.Quantity}</span></p>
                <p>  Sales: <span>{medicine.Sales}</span> </p>
                <p> Prescription based ? :
                    <span style={{ color: medicine.OverTheCounter ? 'red' : 'green' }}>{medicine.OverTheCounter ? " Yes" : " No"} </span>
                     </p>
                <p>Archive Status:
                <span style={{ color: medicine.Archived ? 'red' : 'green' }}>{medicine.Archived ? " Archived" : " Unarchived"}</span> 
                </p>
                
            </div>
        </Col>
      </Row>
    </Container>

             {/* <div className="meds">
        <div className="medscreen_left">
           
            <div className="left_info">
                <p className="left_name">{medicine.Name}</p>
                <p>Price: ${medicine.Price}</p>
                <p>Medical use: {medicine.MedicalUse.join(' ')}</p>
                <p>  Quantity: <span>{medicine.Quantity}</span></p>
            </div>
        </div>
        <div className="medscreen_right">
            <div className="right_info">
                <p>
                    Price: <span>${medicine.Price}</span>
                </p>
                <p>
                    Status: <span>{medicine.Quantity > 0 ? 'In stock' : 'Out of stock'}</span>
                </p>
                <p>
                    Quantity: <span>{medicine.Quantity}</span>
                </p>
                <p>
                   
                </p>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
        </div>
    </div> */}
    </div>:
    //EDIT MODE ON !
    <div>
        <PharmNav/>
        
        <Container style={divStyles} >
      <Row sm={12} md={9} lg={9}>
        <Col sm={12} md={12} lg={6}>
        <div className="left_img">
                {medicine.Picture && medicine.Picture.data && medicine.Picture.contentType && (
                    <div className="imagesize"> 
                     <img
                    src={`data:${medicine.Picture.contentType};base64,${arrayBufferToBase64(
                        medicine.Picture.data.data
                    )}`}
                    alt={medicine.Name}
                /></div>
                  
                )}
            </div>
            <Row>
                <div className='editsectionMdLg' style={{
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "center",

                }}>
                    <Col sm={0} >
                    {/* <Form.Check // prettier-ignore
                        type="switch"
                        id="custom-switch"
                        label="Check this switch"
                        /> */}
                       
                       <Button variant="outline-success" 
                       className='mt-5 '
                       style={{
                        width:"20vw", 
                        margin: "auto", 
                        textAlign: "center",
                        alignItems:"center",
                        justifyContent: "center",
                        display: "block"}}
                            onClick={editMedicine}
                           >Done</Button>
                            
                            
                    </Col>
                    
                </div>
                <Col> <Button variant="outline-danger" 
                        className='mt-5'
                       style={{
                        width:"20vw", 
                        margin: "0 auto", 
                        textAlign: "center",
                        alignItems:"center",
                        justifyContent: "center",
                        display: "block"}}
                            onClick={editmodeOff}
                           >Cancel</Button></Col>
          
        </Row>
        </Col>
        <Col sm={12} md={12} lg={6}>
        <div className="left_info">
                <p className="left_name" id="medicineName" style={{background:"#CCC", borderRadius:"10px"}}>
                {medicine.Name}
                {/* <Form.Control
        type="text"
        placeholder={medicine.Name}
        aria-label="Med Name"
        disabled
        readOnly
      /> */}
                </p>
                <p>Price: 
                    <InputGroup
                    style={{width:"15vw"}}
                    >
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
            required
            type="number"
            placeholder="Price"
            name="newPrice"
            min={0}
    
            defaultValue={medicine.Price}
          />
                    </InputGroup>
              
                    </p>


                <p> Active Ingredients: 
                    
                    
                    {/* EB2A E3MELHA LAMA TE5ALAS BALASH ARAF */}



                {/* <Form>
      {controls.map((control,index) => (
        <div key={control.key} className="d-flex mb-2">
          <Form.Control
            type="text"
            placeholder={`ingredient ${control.key} `}
            defaultValue={medicine.ActiveIngredients[index]}
            onChange={(event) => handleChange(control.key, event)}
            className="me-2"
          />
          {control.key !== 1 && ( // Display Remove button for all controls except the first one
            <Button variant="outline-danger" onClick={() => handleRemoveControl(control.key)}>
              -
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline-dark" onClick={handleAddControl}>
        +
      </Button>
    </Form> */}

      <Form.Control
            required
            type="text"
            placeholder="enter in format ingredient1,ingredient2"
            name="newIngredients"
            defaultValue={concatenatedString}
          />
                
                </p>
                <p style={{background:"#CCC", borderRadius:"10px"}} >Medical use: {medicine.MedicalUse.join(' ')}</p>
                <p>  Quantity: 
                <Form.Control
            required
            type="number"
            placeholder="Quantity"
            name="newQuantity"
            min={0}
    
            defaultValue={medicine.Quantity}
          />
                    </p>
                <p style={{background:"#CCC", borderRadius:"10px"}}>  Sales: <span>{medicine.Sales}</span> </p>
                <p> Prescription based ? :
                <Form.Select aria-label="Default select example" name='overTheCounter'>
                 <option value="false">Yes</option>
                 <option value="true">No</option>
                 </Form.Select>
                     </p>
                <p>Archive Status:
                <Form.Select aria-label="Default select example" name='archiveStatus'>
                 <option value="false">Unarchive</option>
                 <option value="true">Archive</option>
                 </Form.Select>
                
                </p>
                
            </div>
        </Col>
      </Row>
    </Container>
    </div>
        )
    //     <div> 
    //         <PharmNav/>

    //         <Container style={divStyles} >
    //   <Row sm={12} md={9} lg={9}>
    //     <Col sm={12} md={12} lg={6}>
    //     <div className="left_img">
    //             {medicine.Picture && medicine.Picture.data && medicine.Picture.contentType && (
    //                 <div className="imagesize"> 
    //                  <img
    //                 src={`data:${medicine.Picture.contentType};base64,${arrayBufferToBase64(
    //                     medicine.Picture.data.data
    //                 )}`}
    //                 alt={medicine.Name}
    //             /></div>
                  
    //             )}
    //         </div>
    //         <Row>
    //             <div className='editsectionMdLg'>
    //                 <Col sm={0}>
    //                 <Form.Check // prettier-ignore
    //                     type="switch"
    //                     id="custom-switch"
    //                     label="Check this switch"
    //                     />
    //                 </Col>
    //             </div>
          
    //     </Row>
    //     </Col>
    //     <Col sm={12} md={12} lg={6}>
    //     <div className="left_info">
    //             <p className="left_name">{medicine.Name}</p>
    //             <p>Price: ${medicine.Price}</p>
    //             <p> Active Ingredients: <span>{medicine.ActiveIngredients}</span></p>
    //             <p>Medical use: {medicine.MedicalUse.join(' ')}</p>
    //             <p>  Quantity: <span>{medicine.Quantity}</span></p>
    //             <p>  Sales: <span>{medicine.Sales}</span> </p>
                
    //         </div>
    //     </Col>
    //   </Row>
    // </Container>

    //          <div className="meds">
    //     <div className="medscreen_left">
           
    //         <div className="left_info">
    //             <p className="left_name">{medicine.Name}</p>
    //             <p>Price: ${medicine.Price}</p>
    //             <p>Medical use: {medicine.MedicalUse.join(' ')}</p>
    //             <p>  Quantity: <span>{medicine.Quantity}</span></p>
    //         </div>
    //     </div>
    //     <div className="medscreen_right">
    //         <div className="right_info">
    //             <p>
    //                 Price: <span>${medicine.Price}</span>
    //             </p>
    //             <p>
    //                 Status: <span>{medicine.Quantity > 0 ? 'In stock' : 'Out of stock'}</span>
    //             </p>
    //             <p>
    //                 Quantity: <span>{medicine.Quantity}</span>
    //             </p>
    //             <p>
                   
    //             </p>
    //             {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    //         </div>
    //     </div>
    // </div>
    // </div>
      
    );
};

export default Meds2;
