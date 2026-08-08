import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminOrders.css";
import { toast } from "react-toastify";
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });

      alert("Order Updated");

      fetchOrders();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const res = await api.put(`/orders/${id}`, {
        paymentStatus,
      });
  
      console.log("SUCCESS:", res.data);
  
      toast.success("Payment Status Updated");
  
      fetchOrders();
    } catch (err) {
      console.log("ERROR:");
      console.log(err);
  
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
  
      toast.error("Failed to update payment status");
    }
  };

  async function downloadInvoice(id, orderId) {
    try {
      const res = await api.get(`/orders/${id}/invoice`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.log(err);
      toast.error("Unable to download invoice");
    }
  }
  const filteredOrders = orders.filter((order) => {
    const customer = order.user?.name || "";
    const email = order.user?.email || "";
    const dbOrderId = order._id || "";
    const displayOrderId = order.orderId || "";
  
    return (
      (customer.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      dbOrderId.toLowerCase().includes(search.toLowerCase()) ||
      displayOrderId.toLowerCase().includes(search.toLowerCase())) &&
      order.shippingAddress?.houseNo !== "In-Store"
    );
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="admin-orders">
      <h1>Manage Orders</h1>
      <input
  type="text"
  placeholder="Search by customer, email or Order ID..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-box"
/>

      {orders.length === 0 ? (
        <h3>No Orders Found</h3>
      ) : (
        filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
            <h3>{order.user?.name}</h3>

            <p>
                <strong>Order ID:</strong> {order.orderId}
            </p>

            <p>{order.user?.email}</p>
            {order.shippingAddress?.phone && (
              <p>
                <strong>Phone:</strong> {order.shippingAddress.phone}
              </p>
            )}

            <button
              onClick={() => downloadInvoice(order._id, order.orderId)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "#0d6efd",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📄 Download Invoice
            </button>

            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>

            <p>
  <strong>Payment Method:</strong>{" "}
  {order.paymentMethod === "upi" &&
  order.paymentStatus !== "Paid" && (

    <div
      style={{
        marginTop: "12px",
        display: "flex",
        gap: "10px",
      }}
    >

      <button
        onClick={() =>
          updatePaymentStatus(order._id, "Paid")
        }
        style={{
          background: "#28a745",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ✅ Approve Payment
      </button>

      <button
        onClick={() =>
          updatePaymentStatus(order._id, "Rejected")
        }
        style={{
          background: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ❌ Reject Payment
      </button>

    </div>

)}

{order.paymentScreenshot && (
  <>
    <p>
      <strong>Payment Screenshot:</strong>
    </p>

    <img
      src={`//${window.location.host.includes("localhost") ? "localhost:8000" : "pawan-enterprises.onrender.com"}${order.paymentScreenshot}`}
      alt="Payment Screenshot"
      style={{
        width: "220px",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "15px",
        border: "1px solid #ddd",
      }}
      onClick={() =>
        window.open(
          `//${window.location.host.includes("localhost") ? "localhost:8000" : "pawan-enterprises.onrender.com"}${order.paymentScreenshot}`,
          "_blank"
        )
      }
    />
  </>
)}
  {order.paymentMethod?.toUpperCase()}
</p>

<p>
  <strong>Payment Status:</strong>{" "}
  <span
    style={{
      color:
        order.paymentStatus === "Paid"
          ? "green"
          : order.paymentStatus === "Rejected"
          ? "red"
          : "#ff9800",
      fontWeight: "bold",
    }}
  >
    {order.paymentStatus}
  </span>
</p>

{order.paymentMethod === "upi" && (
  <>
    <p>
      <strong>Payment Time:</strong>{" "}
      {order.paymentTime || "Not Provided"}
    </p>

    {order.paymentScreenshot && (
      <div style={{ margin: "10px 0" }}>
        <strong>Payment Screenshot:</strong>

        <br />

        <img
          src={`//${window.location.host.includes("localhost") ? "localhost:8000" : "pawan-enterprises.onrender.com"}${order.paymentScreenshot}`}
          alt="Payment Screenshot"
          style={{
            width: "220px",
            borderRadius: "10px",
            cursor: "pointer",
            marginTop: "10px",
            border: "1px solid #ddd",
          }}
          onClick={() =>
            window.open(
              `http://localhost:8000${order.paymentScreenshot}`,
              "_blank"
            )
          }
        />
      </div>
    )}
  </>
)}

            <p>
              <strong>Address:</strong>{" "}
              {order.shippingAddress?.houseNo}, {order.shippingAddress?.building}, {order.shippingAddress?.street}
              {order.shippingAddress?.landmark && `, ${order.shippingAddress?.landmark}`}, {order.shippingAddress?.city}, {order.shippingAddress?.state || 'Rajasthan'} - {order.shippingAddress?.pincode}
            </p>
            
            {order.location && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <p style={{ margin: '0 0 5px 0' }}><strong>📍 Location Verified</strong></p>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}>
                  Lat: {order.location.latitude}<br/>
                  Lng: {order.location.longitude}<br/>
                  Distance: {order.location.distance} km
                </p>
                <a 
                  href={`https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-btn"
                  style={{ display: 'inline-block', padding: '6px 12px', fontSize: '0.85em', textDecoration: 'none', marginTop: '5px' }}
                >
                  Navigate
                </a>
              </div>
            )}
            <p>
  <strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}
</p>

<p>
  <strong>Payment Status:</strong> {order.paymentStatus}
</p>

{order.paymentTime && (
  <p>
    <strong>Payment Time:</strong> {order.paymentTime}
  </p>
)}

{order.paymentScreenshot && (
  <div style={{ margin: "15px 0" }}>
    <strong>Payment Screenshot</strong>

    <br />

    <img
      src={`//${window.location.host.includes("localhost") ? "localhost:8000" : "pawan-enterprises.onrender.com"}${order.paymentScreenshot}`}
      alt="Payment"
      style={{
        width: "250px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        marginTop: "10px",
        cursor: "pointer",
      }}
      onClick={() =>
        window.open(
          `http://localhost:8000${order.paymentScreenshot}`,
          "_blank"
        )
      }
    />
  </div>
)}

            <p>
              <strong>Products:</strong>
            </p>

            <ul>
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.product?.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <select
              className="status-select"
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
            >
                {order.paymentMethod === "upi" && (
  <div style={{ marginTop: "15px" }}>

    <h4>Payment Verification</h4>

    <select
      value={order.paymentStatus}
      onChange={(e) =>
        updatePaymentStatus(order._id, e.target.value)
      }
    >
      <option>Pending Verification</option>
      <option>Paid</option>
      <option>Rejected</option>
    </select>

  </div>
)}
              <option>Pending</option>
<option>Processing</option>
<option>Shipped</option>
<option>Delivered</option>
<option>Cancelled</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;