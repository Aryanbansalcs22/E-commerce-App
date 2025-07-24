import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../context/ShopContext";

const ProductDisplay = ({ product }) => {
  const { addToCart, isLoggedIn } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");
  const [loginAlertShown, setLoginAlertShown] = useState(false); // 🚨

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      if (!loginAlertShown) {
        alert("Please login first to add items to cart.");
        setLoginAlertShown(true); // ✅ Don't show again
      }
      return;
    }

    if (!selectedSize) {
      setError("Please select a size before adding to cart.");
      return;
    }

    setError("");
    addToCart(product.id, selectedSize);
    alert("Product added to cart!");
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {[...Array(4)].map((_, i) => (
            <img key={i} src={star_icon} alt="star" />
          ))}
          <img src={star_dull_icon} alt="star dull" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">₹{product.old_price}</div>
          <div className="productdisplay-right-price-new">₹{product.new_price}</div>
        </div>

        <p className="productdisplay-right-description">
          {product.description ||
            "Elevate your wardrobe with this premium product. Designed for style and comfort."}
        </p>

        <div className="productdisplay-right-size">
          <h3>Select Size</h3>
          <div className="size-button-wrapper">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={`size-option ${selectedSize === size ? "selected" : ""}`}
                onClick={() => {
                  setSelectedSize(size);
                  setError("");
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleAddToCart} className="add-to-cart-button">
          ADD TO CART
        </button>

        <p className="productdisplay-right-category">
          <span>Category :</span> {product.category}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
