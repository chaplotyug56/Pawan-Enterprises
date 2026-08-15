import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaMinus, FaSearch } from "react-icons/fa";
import QRCode from "react-qr-code";
import api from "../services/api";
import "../styles/ShopBilling.css";
import { useNavigate } from "react-router-dom";

function ShopBilling() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("shopBillingCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Custom Product State
  const [customName, setCustomName] = useState("");
  const [customMrp, setCustomMrp] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customDiscount, setCustomDiscount] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("shopBillingCart", JSON.stringify(cart));
  }, [cart]);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load products");
    }
  }

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const searchTerms = search.toLowerCase().trim().split(/\\s+/);
    const filtered = products.filter((p) => {
      return searchTerms.every((term) => {
        if (p.name.toLowerCase().includes(term)) return true;
        if (p.sku && p.sku.toLowerCase().includes(term)) return true;
        if (p.variants && p.variants.length > 0) {
          return p.variants.some(
            (v) =>
              (v.size && v.size.toLowerCase().includes(term)) ||
              (v.color && v.color.toLowerCase().includes(term)) ||
              (v.sku && v.sku.toLowerCase().includes(term)),
          );
        }
        return false;
      });
    });
    setSuggestions(filtered.slice(0, 8));
  }, [search, products]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error(`Only ${product.stock} available in stock`);
        return;
      }
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setSearch("");
    setSuggestions([]);
  };

  const addCustomProduct = () => {
    if (!customName.trim() || !customPrice) {
      toast.error("Name and Our Price are mandatory");
      return;
    }
    const price = parseFloat(customPrice);
    if (isNaN(price) || price < 0) {
      toast.error("Invalid price");
      return;
    }
    const newItem = {
      _id: "custom_" + Date.now(),
      name: customName,
      price: price,
      mrp: customMrp ? parseFloat(customMrp) : price,
      discount: customDiscount,
      quantity: 1,
      stock: 999999, // practically infinite for billing
      isCustom: true,
      image: "https://via.placeholder.com/150?text=Custom+Item",
    };
    setCart([...cart, newItem]);

    setCustomName("");
    setCustomMrp("");
    setCustomPrice("");
    setCustomDiscount("");
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart.map((item) => {
        if (item._id === id) {
          const newQty = item.quantity + delta;
          if (newQty > item.stock) {
            toast.error(`Only ${item.stock} available`);
            return item;
          }
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const finalTotal = cartTotal;

  const handleGenerateBill = async (e, printAfter = false) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = cart.map((item) => {
        const baseItem = {
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        };
        if (!item.isCustom) {
          baseItem.product = item._id;
        }
        return baseItem;
      });

      const shippingAddress = {
        fullName: customerName,
        phone: customerPhone || "0000000000",
        houseNo: "In-Store",
        building: "Shop Purchase",
        street: "In-Store",
        landmark: "Store Counter",
        city: "In-Store",
        state: "Rajasthan",
        pincode: "000000",
      };

      const location = { lat: 0, lng: 0, address: "Shop Purchase" };

      const formData = new FormData();
      formData.append("items", JSON.stringify(items));
      formData.append("shippingAddress", JSON.stringify(shippingAddress));
      formData.append("location", JSON.stringify(location));
      formData.append(
        "paymentMethod",
        paymentMethod === "cash" ? "cash" : "upi",
      );
      formData.append("paymentTime", new Date().toISOString());

      const res = await api.post("/orders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        // Mark as paid since it's an in-store cash purchase
        await api.put(`/orders/${res.data.order._id}`, {
          paymentStatus: "Paid",
          status: "Delivered",
        });
        toast.success("Bill generated successfully!");
        setCart([]);
        localStorage.removeItem("shopBillingCart");
        setCustomerName("");
        setCustomerPhone("");

        if (printAfter) {
          toast.promise(
            api
              .get(`/orders/${res.data.order._id}/invoice`, {
                responseType: "blob",
              })
              .then((resBlob) => {
                const url = window.URL.createObjectURL(
                  new Blob([resBlob.data], { type: "application/pdf" }),
                );
                window.open(url, "_blank");
                navigate("/admin/shop-bills");
              }),
            {
              pending: "Preparing printable bill...",
              success: "Bill ready for printing",
              error: "Failed to prepare bill",
            },
          );
        } else {
          navigate("/admin/shop-bills");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate bill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shop-billing container section">
      <div className="billing-header">
        <h1>Shop Billing POS</h1>
        <p>Quickly generate bills for in-store customers.</p>
      </div>

      <div className="billing-grid">
        {/* Left Side: Product Search & Customer Details */}
        <div className="billing-left">
          <div className="billing-card">
            <h3>Customer Details</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="Customer Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number (Optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="billing-card search-section">
            <h3>Add Products</h3>
            <div className="pos-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {suggestions.length > 0 && (
              <div className="pos-suggestions">
                {suggestions.map((p) => (
                  <div
                    key={p._id}
                    className="pos-item"
                    onClick={() => addToCart(p)}
                  >
                    <img src={p.image} alt={p.name} />
                    <div className="pos-item-info">
                      <h4>{p.name}</h4>
                      <p>₹{p.price}</p>
                    </div>
                    <span
                      className={`stock-badge ${p.stock > 0 ? "in-stock" : "out-stock"}`}
                    >
                      {p.stock > 0 ? `Stock: ${p.stock}` : "Out of Stock"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="billing-card" style={{ marginTop: "20px" }}>
            <h3>Add Custom Product (Current Bill Only)</h3>
            <div className="input-group" style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Product Name *"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Our Price *"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />
            </div>
            <div className="input-group" style={{ marginBottom: "10px" }}>
              <input
                type="number"
                placeholder="MRP (Optional)"
                value={customMrp}
                onChange={(e) => setCustomMrp(e.target.value)}
              />
              <input
                type="text"
                placeholder="Discount (Optional)"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(e.target.value)}
              />
            </div>
            <button
              className="secondary-btn"
              onClick={addCustomProduct}
              style={{ width: "100%", padding: "10px" }}
            >
              + Add Custom Product
            </button>
          </div>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="billing-right">
          <div className="billing-card cart-section">
            <h3>Current Bill</h3>

            {cart.length === 0 ? (
              <div className="empty-bill">No products added yet.</div>
            ) : (
              <div className="bill-items">
                {cart.map((item) => (
                  <div key={item._id} className="bill-item">
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>
                        ₹{item.price} x {item.quantity}
                      </p>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => updateQuantity(item._id, -1)}>
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)}>
                        <FaPlus />
                      </button>
                      <button
                        className="trash-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bill-summary">
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <div className="billing-payment-options">
              <h4>Payment Method</h4>
              <div className="payment-options-grid">
                <label
                  className={`payment-option ${paymentMethod === "cash" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash
                </label>
                <label
                  className={`payment-option ${paymentMethod === "upi-shop" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    value="upi-shop"
                    checked={paymentMethod === "upi-shop"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Shop QR
                </label>
                <label
                  className={`payment-option ${paymentMethod === "upi-custom" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    value="upi-custom"
                    checked={paymentMethod === "upi-custom"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Custom QR
                </label>
              </div>
            </div>

            {paymentMethod === "upi-custom" && finalTotal > 0 && (
              <div className="custom-qr-container">
                <QRCode
                  value={`upi://pay?pa=9929119290@okbizaxis&pn=Pawan%20Enterprises&am=${Number(finalTotal).toFixed(2)}&cu=INR`}
                  size={150}
                />
                <p>Scan to pay exact ₹{finalTotal}</p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="generate-btn"
                  style={{ flex: 1 }}
                  onClick={(e) => handleGenerateBill(e, false)}
                  disabled={isSubmitting || cart.length === 0}
                >
                  {isSubmitting ? "Generating..." : "Generate Bill"}
                </button>
                <button
                  className="generate-btn"
                  style={{ flex: 1, backgroundColor: "#28a745" }}
                  onClick={(e) => handleGenerateBill(e, true)}
                  disabled={isSubmitting || cart.length === 0}
                >
                  {isSubmitting ? "Generating..." : "🖨️ Generate & Print"}
                </button>
              </div>

              <button
                style={{
                  padding: "14px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  opacity: cart.length === 0 ? 0.5 : 1,
                }}
                disabled={cart.length === 0 || isSubmitting}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear the entire bill?",
                    )
                  ) {
                    setCart([]);
                    localStorage.removeItem("shopBillingCart");
                  }
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopBilling;
