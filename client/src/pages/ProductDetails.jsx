import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import { useCart } from "../context/CartContext";

import { toast } from "react-toastify";

import {
  FaShoppingCart,
  FaBolt,
  FaStar,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";

import "../styles/ProductDetails.css";

import ReviewForm from "../components/ReviewForm";
import ProductCard from "../components/ProductCard";
import { saveRecentlyViewed } from "../services/recentlyViewed";


function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await api.get(`/products/${id}`);

      setProduct(res.data.data);
      setSelectedImage(res.data.data.image);
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedRate(null);

      saveRecentlyViewed(res.data.data);

      const reviewRes = await api.get(`/reviews/${id}`);
      setReviews(reviewRes.data.data);

      const relatedRes = await api.get(
        `/products/${id}/related`
      );

      setRelatedProducts(relatedRes.data.data);

    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (product.hasColors && !selectedColor) { toast.error("Please select a color"); return; }
    if (product.hasSizes && !selectedSize) { toast.error("Please select a size"); return; }
    if (product.hasRates && !selectedRate) { toast.error("Please select a rate"); return; }

    const finalProduct = {
      ...product,
      color: selectedColor?.name,
      colorImage: selectedColor?.image,
      size: selectedSize,
      rate: selectedRate,
      price: selectedRate || product.price
    };
    addToCart(finalProduct);
  };

  const handleBuyNow = () => {
    if (product.hasColors && !selectedColor) { toast.error("Please select a color"); return; }
    if (product.hasSizes && !selectedSize) { toast.error("Please select a size"); return; }
    if (product.hasRates && !selectedRate) { toast.error("Please select a rate"); return; }

    const finalProduct = {
      ...product,
      color: selectedColor?.name,
      colorImage: selectedColor?.image,
      size: selectedSize,
      rate: selectedRate,
      price: selectedRate || product.price
    };
    buyNow(finalProduct);
    navigate("/checkout");
  };

  if (!product) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="product-details container section">

      {/* LEFT SIDE */}

      <div className="details-image">
        <img
          src={selectedImage}
          alt={product.name}
          className="main-product-image"
        />

        {product.images && product.images.length > 0 && (
          <div className="thumbnail-gallery">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}

      <div className="details-content">

        <span className="category">
          {product.category}
        </span>

        <h1>{product.name}</h1>

        <div className="rating">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />

          <span>(4.9)</span>
        </div>

        <div className="price-section">

{product.mrp > product.price && (
  <div className="discount-tag">
    {Math.round(
      ((product.mrp - product.price) / product.mrp) * 100
    )}% OFF
  </div>
)}

<h2 className="our-price">
  ₹{selectedRate || product.price}
</h2>

{product.mrp > (selectedRate || product.price) && (
  <>
    <p className="mrp">
      MRP <del>₹{product.mrp}</del>
    </p>

    <p className="save">
      You Save ₹{product.mrp - (selectedRate || product.price)}
    </p>
  </>
)}

</div>

        <p
          className={
            product.stock > 5
              ? "stock in-stock"
              : product.stock > 0
              ? "stock low-stock"
              : "stock out-stock"
          }
        >
          {product.stock > 5
            ? `In Stock (${product.stock})`
            : product.stock > 0
            ? `Only ${product.stock} left`
            : "Out of Stock"}
        </p>

        <p className="description">
          {product.description}
        </p>

        {/* OPTIONS SELECTION */}
        <div className="product-options-selectors">
          {product.hasColors && product.colors?.length > 0 && (
            <div className="option-section">
              <h3>Select Colour {selectedColor && <span style={{fontSize: "14px", fontWeight: "normal", color: "#666"}}>- {selectedColor.name}</span>}</h3>
              <div className="option-chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {product.colors.map((color, idx) => (
                  <button 
                    key={idx}
                    className={`option-chip ${selectedColor?.name === color.name ? 'selected' : ''}`}
                    style={{
                      padding: "8px 15px", 
                      borderRadius: "20px", 
                      border: selectedColor?.name === color.name ? "2px solid #0056b3" : "1px solid #ddd", 
                      background: selectedColor?.name === color.name ? "#f0f8ff" : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onClick={() => {
                      setSelectedColor(color);
                      if (color.image) setSelectedImage(color.image);
                    }}
                  >
                    {color.image && (
                      <img src={color.image} alt={color.name} style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} />
                    )}
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.hasSizes && product.sizes?.length > 0 && (
            <div className="option-section" style={{ marginTop: "15px" }}>
              <h3>Select Size {selectedSize && <span style={{fontSize: "14px", fontWeight: "normal", color: "#666"}}>- {selectedSize}</span>}</h3>
              <div className="option-chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {product.sizes.map((size, idx) => (
                  <button 
                    key={idx}
                    className={`option-chip ${selectedSize === size ? 'selected' : ''}`}
                    style={{
                      padding: "8px 15px", 
                      borderRadius: "5px", 
                      border: selectedSize === size ? "2px solid #0056b3" : "1px solid #ddd", 
                      background: selectedSize === size ? "#f0f8ff" : "#fff",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.hasRates && product.rates?.length > 0 && (
            <div className="option-section" style={{ marginTop: "15px" }}>
              <h3>Select Rate {selectedRate && <span style={{fontSize: "14px", fontWeight: "normal", color: "#666"}}>- ₹{selectedRate}</span>}</h3>
              <div className="option-chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {product.rates.map((rate, idx) => (
                  <button 
                    key={idx}
                    className={`option-chip ${selectedRate === rate ? 'selected' : ''}`}
                    style={{
                      padding: "8px 15px", 
                      borderRadius: "5px", 
                      border: selectedRate === rate ? "2px solid #0056b3" : "1px solid #ddd", 
                      background: selectedRate === rate ? "#f0f8ff" : "#fff",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                    onClick={() => setSelectedRate(rate)}
                  >
                    ₹{rate}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="info" style={{ marginTop: "20px" }}>

          <p>
            <FaTruck />
            Free Delivery Above ₹1000
          </p>

          <p>
            <FaShieldAlt />
            Genuine Product
          </p>

        </div>

        <div className="detail-actions">

          {product.stock > 0 ? (
            <>
              <button
                className="detail-add-btn"
                onClick={handleAddToCart}
              >
                <FaShoppingCart />
                Add To Cart
              </button>

              <button
  className="detail-buy-btn"
  onClick={handleBuyNow}
>
  <FaBolt />
  Buy Now
</button>
            </>
          ) : (
            <>
              <button
                className="detail-add-btn disabled-btn"
                disabled
              >
                Out of Stock
              </button>

              <button
                className="detail-buy-btn disabled-btn"
                disabled
              >
                <FaBolt />
                Out of Stock
              </button>
            </>
          )}

        </div>

        {/* REVIEW FORM */}

        <div className="review-section">

          <ReviewForm
            productId={product._id}
            onReviewAdded={fetchProduct}
          />

        </div>

        {/* CUSTOMER REVIEWS */}

        <h3>Customer Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              className="review-card"
              key={review._id}
            >
              <h4>{review.user?.name}</h4>

              <p>{"⭐".repeat(review.rating)}</p>

              <p>{review.comment}</p>
            </div>
          ))
        )}

      </div>

      {/* RELATED PRODUCTS */}

      {relatedProducts.length > 0 && (
        <div className="related-products">

          <h2>You May Also Like</h2>

          <div className="products-grid">

            {relatedProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                addToCart={addToCart}
              />
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default ProductDetails;