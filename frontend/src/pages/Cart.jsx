import React, { useContext, useEffect } from 'react';
import CartItems from '../components/CartItems/CartItems';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
  const { fetchCartFromBackend } = useContext(ShopContext);

  useEffect(() => {
    fetchCartFromBackend(); // ensures fresh cart after login or reload
  }, [fetchCartFromBackend]);

  return (
    <div>
      <CartItems />
    </div>
  );
};

export default Cart;
