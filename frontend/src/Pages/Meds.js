// export default Meds2;
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Meds.css';

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
    const [medicines, setMedicines] = useState([]);
    const location = useLocation();
    const { medicineId } = useParams();
    const userId = new URLSearchParams(location.search).get('medicineId');
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const userId = new URLSearchParams(location.search).get('medicineId');
        console.log('UserId:', userId);

        const fetchMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:8000/Patient/getAllMedicine2/', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
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

    const findMedicineById = (medicines, userId) => {
        for (let i = 0; i < medicines.length; i++) {
            if (medicines[i]._id === userId) {
                return medicines[i];
            }
        }
        return null;
    };

    const medicine = findMedicineById(medicines, userId);

    if (!medicine) {
        return <div>Medicine not found</div>;
    }

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        setSelectedQuantity(newQuantity);
    };

    const handleAddToCart = async () => {
        try {
            // Validate selectedQuantity
            const quantityToAdd = parseInt(selectedQuantity, 10);
            if (isNaN(quantityToAdd) || quantityToAdd <= 0 || quantityToAdd > medicine.Quantity) {
                console.error('Invalid quantity selected');
                setErrorMessage('Invalid quantity selected');
                return;
            }

            const response = await axios.post(
                `http://localhost:8000/Patient/addToCart/${medicine._id}`,
                { quantity: quantityToAdd },
                { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
            );

            if (response.status === 200) {
                const cartItem = response.data;
                console.log('Added to cart:', cartItem);

                // Update the quantity based on the selected quantity using functional update
                // Update the quantity based on the selected quantity using functional update
                setMedicines((prevMedicines) => {
                    const updatedMedicines = [...prevMedicines];
                    const index = updatedMedicines.findIndex((m) => m._id === medicine._id);
                    if (index !== -1) {
                        updatedMedicines[index].Quantity -= quantityToAdd / 2;
                    }
                    return updatedMedicines;
                });

                // Reset the selected quantity to 1 after successful addition
                setSelectedQuantity(1);



                // Clear any previous error message
                setErrorMessage('');

            } else {
                console.error('Failed to add to cart');

                // Check if the error is related to no stock available
                if (response.data.success != false) {
                    console.error('No stock available');
                    // Display an alert with the error message
                    window.alert('No stock available');
                    setErrorMessage('No stock available');
                } else {
                    // Display a generic error alert
                    window.alert('Failed to add to cart. Please try again.');
                    setErrorMessage('Failed to add to cart. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setErrorMessage('exceeding the quantity');
        }
    };

    return (
        <div className="meds">
            <div className="medscreen_left">
                <div className="left_img">
                    {medicine.Picture && medicine.Picture.data && medicine.Picture.contentType && (
                        <img
                            src={`data:${medicine.Picture.contentType};base64,${arrayBufferToBase64(
                                medicine.Picture.data.data
                            )}`}
                            alt={medicine.Name}
                        />
                    )}
                </div>
                <div className="left_info">
                    <p className="left_name">{medicine.Name}</p>
                    <p>Price: ${medicine.Price}</p>
                    <p>{medicine.MedicalUse.join(' ')}</p>
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
                        Quantity
                        <select value={selectedQuantity} onChange={handleQuantityChange}>
                            {Array.from({ length: medicine.Quantity + 1 }, (_, i) => (
                                <option key={i} value={i}>
                                    {i}
                                </option>
                            ))}
                        </select>
                    </p>
                    <p>
                        <button type="button" onClick={handleAddToCart}>
                            Add to cart
                        </button>
                    </p>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default Meds2;
