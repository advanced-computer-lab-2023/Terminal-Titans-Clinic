import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

const OrderScreen = () => {
    const [medicines, setMedicines] = useState([]);
    const { orderId } = useParams();
    useEffect(() => {
        // Fetch cart items
        const fetchMedicines = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/Patient/getOrder/${orderId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
                );
                const jsonData = response.data.order;
                // setMedicines(jsonData);
                console.log(jsonData);
                getMedicines(jsonData.items)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMedicines();
    }, []);

    async function getMedicines(orderList) {
        console.log('here');
        try {
            let res = [];
            for (let i = 0; i < orderList.length; i++) {
                console.log(orderList[i]);
                await axios.get(`http://localhost:8000/Patient/getMedicineById/${orderList[i].medicineId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } })
                    .then((response) => {
                        let jsonData = response.data.meds;
                        jsonData.Quantity = orderList[i].quantity;
                        console.log(jsonData);
                        res.push(jsonData);
                    })
            }
            setMedicines(res);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div>
            <div className='d-flex justify-content-between'>
                <div>Order {sessionStorage.getItem('orderNumber')}</div>
            </div>
            <Container className='d-flex justify-content-around'>
                {medicines.map((item) => (
                    <Card style={{ width: '18rem' }}>
                        {item?.Picture && item?.Picture.data && item?.Picture.contentType && (
                            <Card.Img variant="top" src={`data:${item?.Picture.contentType};base64,${arrayBufferToBase64(
                                item?.Picture.data.data
                            )}`} />
                        )}
                        <Card.Body>
                            <Card.Title>{item.Name}</Card.Title>
                            <Card.Text>
                                Active Ingredients
                                <ul>
                                    {item.ActiveIngredients &&
                                        item.ActiveIngredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                </ul>
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Medical Use
                                <ul>
                                    {item.MedicalUse &&
                                        item.MedicalUse.map((medicalUse, index) => (
                                            <li key={index}>{medicalUse}</li>
                                        ))}
                                </ul>
                            </ListGroup.Item>
                            <ListGroup.Item>Price: {item.Price}</ListGroup.Item>
                            <ListGroup.Item>Quantity: {item.Quantity}</ListGroup.Item>
                        </ListGroup>
                    </Card>
                ))}
            </Container>
        </div>
    );
}

export default OrderScreen;