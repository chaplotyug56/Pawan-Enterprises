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

  // Set default variants when product loads
  useEffect(() => {
    if (product?.hasVariants && product.variants?.length > 0) {
      if (!selectedColor && !selectedSize) {
        const firstVariant = product.variants[0];
        if (firstVariant.color) setSelectedColor(firstVariant.color);
        if (firstVariant.size) setSelectedSize(firstVariant.size);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

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
          src={selectedImage?.startsWith("http") || selectedImage?.startsWith("//") ? selectedImage : `//${window.location.host}/api/images/${selectedImage}`}
          alt={product.name}
          className="main-product-image"
        />

        {product.images && product.images.length > 0 && (
          <div className="thumbnail-gallery">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img?.startsWith("http") || img?.startsWith("//") ? img : `//${window.location.host}/api/images/${img}`}
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
          {product.category} {product.subCategory && ` > ${product.subCategory}`}
        </span>

        <h1>{product.name}</h1>
        {product.brand && <p style={{ color: "#666", fontSize: "14px", marginTop: "-5px", marginBottom: "15px" }}>By <strong>{product.brand}</strong></p>}

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
                  <div className="discount-tag" style={{ display: "inline-block", background: "#28a745", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
                    {Math.round(((displayMrp - displayPrice) / displayMrp) * 100)}% OFF
                  </div>
                )}

                <h2 className="our-price" style={{ color: "#dc3545", fontSize: "32px", margin: "5px 0" }}>
                  ₹{displayPrice}
                </h2>

                {displayMrp > displayPrice && (
                  <>
                    <p className="mrp" style={{ color: "#666", fontSize: "16px", marginBottom: "2px" }}>
                      MRP <del>₹{displayMrp}</del>
                    </p>

                    <p className="save" style={{ color: "#28a745", fontWeight: "bold", fontSize: "14px", marginTop: 0 }}>
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
                displayStock > (product.lowStockThreshold || 5)
                  ? "stock in-stock"
                  : displayStock > 0
                  ? "stock low-stock"
                  : "stock out-stock"
              }
              style={{
                display: "inline-block",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                background: displayStock > (product.lowStockThreshold || 5) ? "#e6f4ea" : displayStock > 0 ? "#fdf6b2" : "#fde8e8",
                color: displayStock > (product.lowStockThreshold || 5) ? "#1e4620" : displayStock > 0 ? "#723b13" : "#9b1c1c",
                marginTop: "10px"
              }}
            >
              {displayStock > (product.lowStockThreshold || 5)
                ? "In Stock"
                : displayStock > 0
                ? `Low Stock - Only ${displayStock} left`
                : "Out of Stock"}
            </p>
          );
        })()}

        <p className="description" style={{ marginTop: "15px", lineHeight: "1.6", color: "#444" }}>
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
                        background: colorImage ? `url(${colorImage?.startsWith("http") || colorImage?.startsWith("//") ? colorImage : `//${window.location.host}/api/images/${colorImage}`}) center/cover` : (selectedColor === color ? "#f0f8ff" : "#fff"),
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
                {availableSizes.map((size, idx) => {
                  return (
                    <button 
                      key={idx}
                      className={`option-chip ${selectedSize === size ? 'selected' : ''}`}
                      style={{
                        minWidth: "60px",
                        height: "40px",
                        borderRadius: "20px", 
                        border: selectedSize === size ? "2px solid #0056b3" : "1px solid #ddd", 
                        background: selectedSize === size ? "#e6f2ff" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: selectedSize === size ? "#0056b3" : "#333",
                        fontWeight: "bold",
                        fontSize: "14px",
                        padding: "0 15px",
                      }}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="info" style={{ marginTop: "20px", background: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #eee" }}>
          
          {product.deliveryAvailable !== false && (
             <p style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", color: "#333", fontWeight: "500" }}>
               <FaTruck style={{ color: "#0056b3" }} />
               {product.freeDeliveryAbove > 0 ? `Free Delivery Above ₹${product.freeDeliveryAbove}` : "Free Delivery"}
               {product.estimatedDeliveryTime && <span style={{ fontSize: "12px", color: "#666", marginLeft: "auto", fontWeight: "normal" }}>({product.estimatedDeliveryTime})</span>}
             </p>
          )}

          <p style={{ display: "flex", alignItems: "center", gap: "10px", color: "#333", fontWeight: "500", marginBottom: 0 }}>
            <FaShieldAlt style={{ color: "#28a745" }} />
            100% Genuine Product
          </p>

        </div>

        {/* EXTRA DETAILS LIST */}
        <div style={{ marginTop: "20px" }}>
           <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
             {(currentVariant?.sku || product.sku) && (
               <li style={{ display: "flex", fontSize: "14px" }}><span style={{ width: "120px", color: "#666" }}>SKU:</span> <strong>{currentVariant?.sku || product.sku}</strong></li>
             )}
             {product.weight > 0 && (
               <li style={{ display: "flex", fontSize: "14px" }}><span style={{ width: "120px", color: "#666" }}>Weight:</span> <strong>{product.weight} {product.unit}</strong></li>
             )}
             {product.manufacturer && (
               <li style={{ display: "flex", fontSize: "14px" }}><span style={{ width: "120px", color: "#666" }}>Manufacturer:</span> <strong>{product.manufacturer}</strong></li>
             )}
             {product.countryOfOrigin && (
               <li style={{ display: "flex", fontSize: "14px" }}><span style={{ width: "120px", color: "#666" }}>Origin:</span> <strong>{product.countryOfOrigin}</strong></li>
             )}
             {product.expiryDate && (
               <li style={{ display: "flex", fontSize: "14px" }}><span style={{ width: "120px", color: "#666" }}>Expiry:</span> <strong>{product.expiryDate}</strong></li>
             )}
           </ul>
        </div>

        <div className="detail-actions" style={{ marginTop: "25px", display: "flex", gap: "15px" }}>

          {(((product.hasVariants && currentVariant) ? currentVariant.stock : product.stock) > 0 || product.allowOutOfStockPurchase) ? (
            <>
              <button
                className="detail-add-btn"
                style={{ flex: 1, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#fff", color: "#0056b3", border: "2px solid #0056b3", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "0.2s" }}
                onClick={handleAddToCart}
              >
                <FaShoppingCart />
                Add To Cart
              </button>

              <button
                className="detail-buy-btn"
                style={{ flex: 1, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#0056b3", color: "#fff", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "0.2s" }}
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
                style={{ flex: 1, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#f0f0f0", color: "#999", border: "2px solid #ddd", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "not-allowed" }}
                disabled
              >
                Out of Stock
              </button>

              <button
                className="detail-buy-btn disabled-btn"
                style={{ flex: 1, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#f0f0f0", color: "#999", border: "2px solid #ddd", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "not-allowed" }}
                disabled
              >
                <FaBolt />
                Out of Stock
              </button>
            </>
          )}

        </div>

        {/* REVIEW FORM */}

        <div className="review-section" style={{ marginTop: "40px" }}>

          <ReviewForm
            productId={product._id}
            onReviewAdded={fetchProduct}
          />

        </div>

        {/* CUSTOMER REVIEWS */}

        <h3 style={{ marginTop: "30px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Customer Reviews</h3>

        {reviews.length === 0 ? (
          <p style={{ color: "#666", marginTop: "15px" }}>No reviews yet. Be the first to review this product!</p>
        ) : (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            {reviews.map((review) => (
              <div
                className="review-card"
                key={review._id}
                style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", border: "1px solid #eaeaea" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <h4 style={{ margin: 0, color: "#333" }}>{review.user?.name}</h4>
                  <span style={{ fontSize: "12px", color: "#999" }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
  
                <p style={{ margin: "5px 0", color: "#ffc107" }}>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</p>
  
                <p style={{ margin: "5px 0 0", color: "#555", fontSize: "14px" }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* RELATED PRODUCTS */}

      {relatedProducts.length > 0 && (
        <div className="related-products" style={{ width: "100%", marginTop: "50px" }}>

          <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", marginBottom: "20px" }}>You May Also Like</h2>

          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>

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