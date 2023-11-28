// CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const updateCartItems = (newItems) => {
    setCartItems(newItems);
  };

  return (
    <CartContext.Provider value={{ cartItems, updateCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
