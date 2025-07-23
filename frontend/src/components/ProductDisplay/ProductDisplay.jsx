import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";

const ProductDisplay = () => {
  const { all_product, addToCart } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((item) => item.id === Number(productId));
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) return <div>Product not found.</div>;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      alert("Please login to add items to cart.");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    try {
      const response = await fetch("https://e-commerce-app-backend-73bp.onrender.com/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ itemId: product.id, size: selectedSize }),
      });

      const data = await response.text();
      if (response.ok) {
        addToCart(product.id); // Context update
        alert("Item added to cart!");
      } else {
        alert("Failed to add to cart: " + data);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("An error occurred. Try again.");
    }
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt={product.name} />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>

        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_dull_icon} alt="star" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">₹{product.old_price}</div>
          <div className="productdisplay-right-price-new">₹{product.new_price}</div>
        </div>

        <div className="productdisplay-right-description">
          Elevate your wardrobe with this premium product. Designed for style and comfort.
        </div>

        {/* Size Selection */}
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={`size-option ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <button
          className="add-to-cart-button"
          disabled={!selectedSize}
          onClick={handleAddToCart}
        >
          {selectedSize ? "ADD TO CART" : "SELECT SIZE FIRST"}
        </button>

        <div className="productdisplay-right-category">
          <span>Category: </span>{product.category}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
