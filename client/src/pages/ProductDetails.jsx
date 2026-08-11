import { useEffect, useState, useCallback, useMemo } from "react";
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

  const uniqueColors = useMemo(() => {
    if (product?.hasVariants) {
      const colors = product.variants.map(v => v.color).filter(Boolean);
      return [...new Set(colors)];
    }
    if (product?.hasColors && product.colors) {
      return product.colors.map(c => c.name);
    }
    return [];
  }, [product]);

  const availableSizes = useMemo(() => {
    if (product?.hasVariants) {
      let variants = product.variants;
      if (selectedColor) {
        variants = variants.filter(v => v.color === selectedColor);
      }
      const sizes = variants.map(v => v.size).filter(Boolean);
      return [...new Set(sizes)];
    }
    if (product?.hasSizes && product.sizes) {
      return product.sizes;
    }
    return [];
  }, [product, selectedColor]);

  const currentVariant = useMemo(() => {
    if (product?.hasVariants) {
      return product.variants.find(v => 
        v.color === (selectedColor || "") && v.size === (selectedSize || "")
      ) || product.variants[0]; // fallback to first if none strictly match yet
    }
    return null;
  }, [product, selectedColor, selectedSize]);

  // Backward compatibility for old product selected image
  useEffect(() => {
    if (currentVariant?.image) {
      setSelectedImage(currentVariant.image);
    } else if (!product?.hasVariants && product?.hasColors && selectedColor) {
      const colorObj = product.colors.find(c => c.name === selectedColor);
      if (colorObj?.image) {
        setSelectedImage(colorObj.image);
      }
    } else if (product?.image) {
      setSelectedImage(product.image);
    }
  }, [currentVariant, product, selectedColor]);



  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await api.get(`/products/${id}`);

      setProduct(res.data.data);
      setSelectedImage(res.data.data.image);
      setSelectedColor(null);
      setSelectedSize(null);

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
    if (product.hasVariants || product.hasColors || product.hasSizes) {
      if (uniqueColors.length > 0 && !selectedColor) { toast.error("Please select a color"); return; }
      if (availableSizes.length > 0 && !selectedSize) { toast.error("Please select a size"); return; }
    }

    const finalProduct = {
      ...product,
      color: selectedColor,
      size: selectedSize,
      price: currentVariant ? currentVariant.price : product.price,
      image: currentVariant?.image 
        ? currentVariant.image 
        : (!product.hasVariants && product.hasColors && selectedColor)
          ? product.colors.find(c => c.name === selectedColor)?.image || product.image
          : product.image
    };
    addToCart(finalProduct);
  };

  const handleBuyNow = () => {
    if (product.hasVariants || product.hasColors || product.hasSizes) {
      if (uniqueColors.length > 0 && !selectedColor) { toast.error("Please select a color"); return; }
      if (availableSizes.length > 0 && !selectedSize) { toast.error("Please select a size"); return; }
    }

    const finalProduct = {
      ...product,
      color: selectedColor,
      size: selectedSize,
      price: currentVariant ? currentVariant.price : product.price,
      image: currentVariant?.image 
        ? currentVariant.image 
        : (!product.hasVariants && product.hasColors && selectedColor)
          ? product.colors.find(c => c.name === selectedColor)?.image || product.image
          : product.image
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
          {(() => {
            const displayPrice = currentVariant ? currentVariant.price : product.price;
            const displayMrp = currentVariant ? currentVariant.mrp : product.mrp;
            
            return (
              <>
                {displayMrp > displayPrice && (
                  <div className="discount-tag">
                    {Math.round(((displayMrp - displayPrice) / displayMrp) * 100)}% OFF
                  </div>
                )}

                <h2 className="our-price">
                  ₹{displayPrice}
                </h2>

                {displayMrp > displayPrice && (
                  <>
                    <p className="mrp">
                      MRP <del>₹{displayMrp}</del>
                    </p>

                    <p className="save">
                      You Save ₹{displayMrp - displayPrice}
                    </p>
                  </>
                )}
              </>
            );
          })()}
        </div>

        {(() => {
          const displayStock = (product.hasVariants && currentVariant) ? currentVariant.stock : product.stock;
          return (
            <p
              className={
                displayStock > 5
                  ? "stock in-stock"
                  : displayStock > 0
                  ? "stock low-stock"
                  : "stock out-stock"
              }
            >
              {displayStock > 5
                ? `In Stock (${displayStock})`
                : displayStock > 0
                ? `Only ${displayStock} left`
                : "Out of Stock"}
            </p>
          );
        })()}

        <p className="description">
          {product.description}
        </p>

        {/* OPTIONS SELECTION */}
        <div className="product-options-selectors">
          {uniqueColors.length > 0 && (
            <div className="option-section">
              <h3>Select Colour {selectedColor && <span style={{fontSize: "14px", fontWeight: "normal", color: "#666"}}>- {selectedColor}</span>}</h3>
              <div className="option-chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {uniqueColors.map((color, idx) => {
                  let colorImage = null;
                  if (product.hasVariants) {
                    const colorVariant = product.variants.find(v => v.color === color);
                    colorImage = colorVariant?.image;
                  } else if (product.hasColors) {
                    const colorObj = product.colors.find(c => c.name === color);
                    colorImage = colorObj?.image;
                  }

                  return (
                    <button 
                      key={idx}
                      className={`option-chip ${selectedColor === color ? 'selected' : ''}`}
                      style={{
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%", 
                        border: selectedColor === color ? "3px solid #0056b3" : "1px solid #ddd", 
                        background: colorImage ? `url(${colorImage}) center/cover` : (selectedColor === color ? "#f0f8ff" : "#fff"),
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colorImage ? "#fff" : "#333",
                        textShadow: colorImage ? "1px 1px 3px rgba(0,0,0,0.9), 0px 0px 5px rgba(0,0,0,0.6)" : "none",
                        fontWeight: "bold",
                        fontSize: "11px",
                        lineHeight: "1.2",
                        textAlign: "center",
                        padding: "2px",
                        overflow: "hidden"
                      }}
                      onClick={() => {
                        setSelectedColor(color);
                        if (!availableSizes.includes(selectedSize)) {
                          setSelectedSize(null);
                        }
                      }}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className="option-section" style={{ marginTop: "15px" }}>
              <h3>Select Size {selectedSize && <span style={{fontSize: "14px", fontWeight: "normal", color: "#666"}}>- {selectedSize}</span>}</h3>
              <div className="option-chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {availableSizes.map((size, idx) => (
                  <button 
                    key={idx}
                    className={`option-chip ${selectedSize === size ? 'selected' : ''}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%", 
                      border: selectedSize === size ? "3px solid #0056b3" : "1px solid #ddd", 
                      background: selectedSize === size ? "#f0f8ff" : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "14px"
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
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

          {((product.hasVariants && currentVariant) ? currentVariant.stock : product.stock) > 0 ? (
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