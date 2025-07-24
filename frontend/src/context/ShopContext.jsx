import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";

const ProductDisplay = () => {
  const { all_product, addToCart, isLoggedIn } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((item) => item.id === Number(productId));

  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please login to add products to the cart.");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    addToCart(product.id, selectedSize);
    alert("Product added to cart successfully!");
  };

  if (!product) {
    return <div>Loading product...</div>;
  }

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img">
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-newprice">₹{product.new_price}</div>
          <div className="productdisplay-right-oldprice">₹{product.old_price}</div>
        </div>

        <div className="productdisplay-right-size">
          <p>Select Size:</p>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleAddToCart}>ADD TO CART</button>
      </div>
    </div>
  );
};

export default ProductDisplay;
