import React, { useEffect, useState } from 'react';
import "../Styles/LoginForm.css";
import '../Styles/address.css';
import axios from 'axios';
var finalAddress;
function Address() {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState('');
  const [selectedAddress, setselectedAddress] = useState(-1);



  const handleChooseAddress = (index) => {
    setselectedAddress(index);
    finalAddress = addresses.address[index];
  }

  const addAddress = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a JSON object with the username and password
    const data = { address };

    // Make a POST request to your backend register route
    await fetch('http://localhost:8000/Patient/addAddress', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem("token"),//the token is a variable which holds the token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json()).then(data => {
        window.location.reload();
        if (data.success) {
        }
        else {
          alert(data.message)
        }
      })
      .catch((error) => {

        console.error('Error:', error);
      });

  };
  useEffect(() => {
    // Fetch addresses when the component mounts
    fetch('http://localhost:8000/Patient/getAddresses', {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem("token"),//the token is a variable which holds the token,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => setAddresses(data))
      .catch(error => console.error('Error fetching addresses: ', error));
      
      console.log(finalAddress)
  }, []);
  console.log(Array.isArray(addresses.address));

  return (

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
      <div>
        <div style={{ float: 'center', paddingTop: '122px' }}>

          <div id="login-form">
            {/* <h1>Sign up</h1> */}
            <form>
              <h5>Add an address</h5>
              <br></br>
              <label htmlFor="address">address:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}></input> <br />



              <button type="submit" onClick={addAddress}>Add Address</button>

            </form>
          </div>
        </div>
      </div>
      <div></div>
      <div className="card-container">
        <div className="card" >
          <div className="card-content">
            <h2>Choose an already registered Address:</h2><br></br>

            <div className="address-list">
              {Array.isArray(addresses.address) && addresses.address.map((address, index) => (
                <div className="card-container" key={index}
                  onClick={() => handleChooseAddress(index)}>
                  {<div className={`card ${selectedAddress === index ? "color: #00ff00;" : "background-color: #000000;"}`}>
                    <span
                      className={` ${selectedAddress === index ? "dot2" : "dot"}`}>
                    </span>
                    <div className="card-content">
                      <p>{address}</p>

                    </div>

                  </div>}
                </div>

              ))}

            </div>
          </div>
        </div>
      </div>


    </div>




  );

}
export { finalAddress };
export default Address;
