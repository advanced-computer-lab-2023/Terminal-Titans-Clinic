import "../Styles//cartScreen.css"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const OrderScreen = () => {
    const [orderItems, updateOrderItems] = useState([]);

    useEffect(() => {
        // Fetch cart items
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/Patient/getOrder', {
                    headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
                });
                console.log(response);
                let totalQuantity = 0;
                for (let i = 0; i < response.data.order.length; i++) {
                    for (let j = 0; j < response.data.order[i].items.length; j++) {
                        totalQuantity += response.data.order[i].items[j].quantity;
                    }
                    response.data.order[i].totalQuantity = totalQuantity;
                    totalQuantity = 0;
                }
                console.log(response.data.order);
                updateOrderItems(response.data.order);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchOrders();
    }, []); // Remove updateOrderItems from the dependency array to prevent unnecessary re-renders

    const viewOrder = (id,index) => {
        window.location.href = `/orderDetails/${id}`;
    }

    const cancelOrder = async (id) => {
        try {
            const response = await axios({
                method: 'put', //you can set what request you want to be
                url: `http://localhost:8000/Patient/cancelOrder/${id}`,
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }
            })
            // axios.put(`http://localhost:8000/Patient/cancelOrder/${id}`,null,{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}})
            // const response = await axios.put(`http://localhost:8000/Patient/cancelOrder/${id}`,{
            //     headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") }
            // });
            // console.log(response);
            console.log(response);
            updateOrderItems(response.data.myOrders);
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-evenly flex-wrap">
                {orderItems.map((item, index) => (
                    <Card key={item._id} border="secondary" style={{ width: '18rem', marginBottom: '20px' }}>
                        <Card.Header>{item._id}</Card.Header>
                        <Card.Body>
                            <Card.Title>Order {index + 1}</Card.Title>
                            {/* Display other information from the item */}
                            <Card.Subtitle className="mb-2 text-muted">{item.status}</Card.Subtitle>
                            <Card.Text>
                                <ListGroup>
                                <ListGroup.Item action href="#link1">
                                        Address: {item.address}
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#link1">
                                        Total Price: ${item.total}
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#link2" disabled>
                                        Total Quantity: {item.totalQuantity}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Text>
                            {/* Add additional content as needed */}
                            <Card.Link style={{ cursor: 'pointer' }} onClick={() => viewOrder(item._id,index)}>View</Card.Link>
                            <Card.Link style={{ cursor: 'pointer' }} onClick={() => cancelOrder(item._id)}>Cancel</Card.Link>
                        </Card.Body>
                    </Card>
                ))}
            </div>

        </div>
    );
};

export default OrderScreen;
