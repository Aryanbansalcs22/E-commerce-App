import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};  
  for (let index = 0; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [sizeData, setSizeData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ new state

  useEffect(() => {
    fetch('https://e-commerce-app-backend-73bp.onrender.com/allproducts')
      .then((res) => res.json())
      .then((data) => setAll_Product(data));

    const token = localStorage.getItem("auth-token");
    if (token) setIsLoggedIn(true); // ✅ check login status

    fetchCartFromBackend();
  }, []);

  const fetchCartFromBackend = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    try {
      const res = await fetch('https://e-commerce-app-backend-73bp.onrender.com/getcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      console.log("Fetched cart from backend:", data);

      if (data.cartData) setCartItems(data.cartData);
      if (data.sizeData) setSizeData(data.sizeData);
    } catch (err) {
      console.error("GetCart Error:", err);
    }
  };

  const addToCart = (itemId, size) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    setSizeData((prev) => ({ ...prev, [itemId]: size }));

    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("https://e-commerce-app-backend-73bp.onrender.com/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ itemId, size }),
      })
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const data = await res.json();
            console.log("Add to cart:", data);
          } else {
            const text = await res.text();
            console.warn("Non-JSON response:", text);
          }
        })
        .catch((err) => console.error("AddToCart error:", err));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("https://e-commerce-app-backend-73bp.onrender.com/removefromcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Remove from cart:", data.message))
        .catch((err) => console.error("Remove error:", err));
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = all_product.find(p => p.id === Number(itemId));
        if (product) {
          total += product.new_price * cartItems[itemId];
        }
      }
    }
    return total;
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const contextValue = {
    all_product,
    cartItems,
    sizeData,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    fetchCartFromBackend,
    isLoggedIn, // ✅ added to context
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
