import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

const ProductDisplay = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeError, setShowSizeError] = useState(false);
  const [loginAlertShown, setLoginAlertShown] = useState(false);
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      if (!loginAlertShown) {
        alert("Please login first!");
        setLoginAlertShown(true);
        navigate("/login");
      }
      return;
    }

    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }

    addToCart(product.id);
    setShowSizeError(false);
    alert("Product added to cart successfully!");
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="small-1" />
          <img src={product.image} alt="small-2" />
          <img src={product.image} alt="small-3" />
          <img src={product.image} alt="small-4" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="main" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {[...Array(4)].map((_, i) => (
            <img key={i} src={star_icon} alt="star" />
          ))}
          <img src={star_dull_icon} alt="star dull" />
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>

        <div className="productdisplay-right-description">{product.description}</div>

        <div className="productdisplay-right-size">
          <h3>Select Size</h3>
          {showSizeError && <div className="error-text">Please select a size</div>}
          <div className="size-button-wrapper">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={`size-option ${selectedSize === size ? "selected" : ""}`}
                onClick={() => {
                  setSelectedSize(size);
                  setShowSizeError(false);
                }}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Add to Cart
        </button>

        <p className="productdisplay-right-category">
          <span>Category:</span> {product.category}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags:</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
