import "../Styles/cartScreen.css"
// // import CartItem from "../Components/CartItem";
// // const cartScreen = () =>{
// //     return(
// //         <div className="cartscreen">
// //             <div className="cart_left">
// //                 <h2>Shopping Cart</h2>
// //                 <CartItem/>
// //                 <CartItem/>
// //                 <CartItem/>

// //                 <CartItem/>

// //             </div>
// //             <div className="cart_right">
// //                 <div className="cart_info">
// //                     <p>Subtotal (0) items</p>
// //                     <p>$1000</p>
// //                 </div>
// //                 <div>
// //                     <button>Checkout</button>        
// //                 </div>
        
// //             </div>

// //         </div>
// //     )
// // } 

// // export default cartScreen;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import "./cartScreen.css";
// import CartItem from "../Components/CartItem";

// const CartScreen = () => {
//     const [cartItems, setCartItems] = useState([]);

//     useEffect(() => {
//         // Make a GET request to your backend API to fetch cart items
//         axios.get('http://localhost:8000/Patient/cart')
//             .then((response) => {
//                 setCartItems(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching cart items:', error);
//             });
//     }, []);

//     return (
//         <div className="cartscreen">
//             <div className="cart_left">
//                 <h2>Shopping Cart</h2>
//                 {cartItems.map((item) => (
//                     <CartItem key={item._id} item={item} />
//                 ))}
//             </div>
//             <div className="cart_right">
//                 <div className="cart_info">
//                     <p>Subtotal ({cartItems.length}) items</p>
//                     {/* Calculate the total price based on the items in the cart */}
//                     <p>${cartItems.reduce((total, item) => total + item.price, 0)}</p>
//                 </div>
//                 <div>
//                     <button>Checkout</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CartScreen;
// CartScreen.js
// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { useCart } from '../Components/CartContext'; // Import the useCart hook
// import CartItem from '../Components/CartItem';

// const CartScreen = () => {
//   const { cartItems, updateCartItems } = useCart();

//   useEffect(() => {
//     // Fetch cart items when the component mounts
//     axios.get('http://localhost:8000/Patient/cart')
//       .then((response) => {
//         updateCartItems(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching cart items:', error);
//       });
//   }, [updateCartItems]);

//   return (
//     <div className="cartscreen">
//       <div className="cart_left">
//         <h2>Shopping Cart</h2>
//         {cartItems.map((item) => (
//           <CartItem key={item._id} item={item} />
//         ))}
//       </div>
//       <div className="cart_right">
//         <div className="cart_info">
//           <p>Subtotal ({cartItems.length}) items</p>
//           {/* Calculate the total price based on the items in the cart */}
//           <p>${cartItems.reduce((total, item) => total + item.price, 0)}</p>
//         </div>
//         <div>
//           <button>Checkout</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartScreen;
// CartScreen.js
// Import React and other necessary modules
// Import React and other necessary modules
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../components/CartContext';
import CartItem from '../components/CartItem';

const CartScreen = () => {
  const { cartItems, updateCartItems } = useCart();
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    // Fetch cart items
    axios.get('http://localhost:8000/Patient/cart',{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}})
      .then((response) => {
        console.log(response);
        updateCartItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });

    // Fetch total sum
    axios.get('http://localhost:8000/Patient/cart/total',{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}})
      .then((response) => {
        console.log(response);
        setTotalSum(response.data.totalPrice); // Assuming the response structure has a key 'totalPrice'
      })
      .catch((error) => {
        console.error('Error fetching total sum:', error);
      });
  }, [updateCartItems]);

  return (
    <div className="cartscreen">
      <div className="cart_left">
        <h2>Shopping Cart</h2>
        {cartItems.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>
      <div className="cart_right">
        <div className="cart_info">
          <p>Subtotal ({cartItems.length}) items</p>
          <p>${totalSum}</p>
        </div>
        <div>
          <button onClick={() => window.location.pathname='./checkout'}>Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
