import React, { useContext, useEffect } from 'react';
import CartItems from '../components/CartItems/CartItems';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
  const { fetchCartFromBackend } = useContext(ShopContext);

  useEffect(() => {
    fetchCartFromBackend(); 
  }, []);

  return (
    <div>
      <CartItems />
    </div>
  );
};

export default Cart;
