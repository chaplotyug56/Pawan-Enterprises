import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import { useCart } from "../context/CartContext";

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

  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await api.get(`/products/${id}`);

      setProduct(res.data.data);
      setSelectedImage(res.data.data.image);

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
  ₹{product.price}
</h2>

{product.mrp > product.price && (
  <>
    <p className="mrp">
      MRP <del>₹{product.mrp}</del>
    </p>

    <p className="save">
      You Save ₹{product.mrp - product.price}
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

        <div className="info">

          <p>
            <FaTruck />
            Free Delivery Available
          </p>

          <p>
            <FaShieldAlt />
            Genuine Product
          </p>

        </div>

        <div className="actions">

          {product.stock > 0 ? (
            <>
              <button
                className="add-btn"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart />
                Add To Cart
              </button>

              <button
  className="buy-btn"
  onClick={() => {
    buyNow(product);
    navigate("/checkout");
  }}
>
  <FaBolt />
  Buy Now
</button>
            </>
          ) : (
            <>
              <button
                className="add-btn disabled-btn"
                disabled
              >
                Out of Stock
              </button>

              <button
                className="buy-btn disabled-btn"
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