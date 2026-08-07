import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
} from "react-icons/fa";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import "../styles/ProductCard.css";

function ProductCard({ product, addToCart }) {

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  if (!product) return null;

  const inWishlist = wishlist.some(
    (item) => item._id === product._id
  );

  // Real Discount Calculation
  const discount =
    product.mrp > product.price
      ? Math.round(
          ((product.mrp - product.price) /
            product.mrp) *
            100
        )
      : 0;

  const saveAmount =
    product.mrp > product.price
      ? product.mrp - product.price
      : 0;


  return (
    <div className="product-card">

      {discount > 0 && (
        <div className="discount-badge">
          {discount}% OFF
        </div>
      )}

      <button
        className={`wishlist-btn ${
          inWishlist ? "active" : ""
        }`}
        onClick={() =>
          inWishlist
            ? removeFromWishlist(product._id)
            : addToWishlist(product)
        }
      >
        <FaHeart />
      </button>

      <Link to={`/product/${product._id}`}>
        <div className="product-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>
      </Link>

      <div className="product-content">

        <span className="brand">
          {product.brand || "Pawan Enterprises"}
        </span>

        <Link
          to={`/product/${product._id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="rating">
          <FaStar className="star-icon" />

          <span>
            {(product.averageRating || 0).toFixed(1)}
          </span>

          <span className="review-count">
            ({product.reviewCount || 0} Reviews)
          </span>
        </div>

        <div className="price-row">

          <div>

            <h3>
              ₹{product.price}
            </h3>

            {product.mrp > product.price && (
              <del>
                ₹{product.mrp}
              </del>
            )}

          </div>

          {saveAmount > 0 && (
            <small className="save-price">
              Save ₹{saveAmount}
            </small>
          )}

        </div>

        <div className="stock">
          {product.stock > 0
            ? "✅ In Stock"
            : "❌ Out of Stock"}
        </div>

        <div className="actions">

          <button
            className="cart-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <FaShoppingCart />
            Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;