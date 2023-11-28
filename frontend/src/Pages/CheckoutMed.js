import React, { useState } from 'react';
import '../Styles/checkoutMed.css';
import Address from '../components/addAddress';
import OrderDetails from '../components/orderDetails';
import { finalAddress } from '../components/addAddress';
import {total} from '../components/orderDetails';
import '../Styles/orderDetails.css';
import PaymentPharm from '../components/paymentMethodPharm';

function payment(){
  
}

function Checkout() {
  const [selectedStep, setSelectedStep] = useState(0);

  let steps = [
   <OrderDetails/>,
    <Address/>,
    <PaymentPharm/>
  ];

  const handleCircleClick = (index) => {
    setSelectedStep(index);
  };

  return (
  <div style={{ paddingLeft: '100px' ,paddingRight:'100px'}}>
      
    <div className="checkout">
      <div className="timeline">
        {steps.map((step, index) => (
          <div
            className={`circle ${selectedStep > index ? "active" : ""}`}
            key={index}
            onClick={() => handleCircleClick(index)}
          >
            <div style={{ float: 'center', paddingTop: '10px' }}></div>
            {index < 2 && <div className={`line ${selectedStep === index ? " height: 3px;" : "height: 1px;"}`}></div>}          </div>
        ))}
      </div>
      <div className="btn-container" style={{ textAlign: 'right' }}>
        <button className="btn" style={{ backgroundColor: '#000000',color:'#ffffff' }} onClick={() => handleCircleClick(selectedStep + 1)}>Next</button>
      </div>
      <div className="content">
        {steps.map((step, index) => (
          selectedStep === index && step
        ))}
      </div>
      </div>
          
      
    </div>
  );
}

export default Checkout;
