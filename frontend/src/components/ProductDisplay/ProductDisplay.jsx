import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import "./ProductDisplay.css";

const ProductDisplay = () => {
  const { all_product, addToCart, isLoggedIn } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const selectedProduct = all_product.find(
      (item) => item.id === Number(productId)
    );
    setProduct(selectedProduct);
  }, [all_product, productId]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    addToCart(product.id, selectedSize);
    alert("Product added to cart");
  };

  if (!product) return <div>Loading...</div>;

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
          <div className="productdisplay-right-newprice">₹{product.new_price}</div>
          <div className="productdisplay-right-oldprice">₹{product.old_price}</div>
        </div>

        <div className="productdisplay-right-size">
          <p>Select Size:</p>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={selectedSize === size ? "active" : ""}
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
