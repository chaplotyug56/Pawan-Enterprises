import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminOrders.css";
import { toast } from "react-toastify";

function StaffDashboard() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const querySearch = searchParams.get("search");
    if (querySearch !== null) {
      setSearch(querySearch);
    }
  }, [searchParams]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch delivery orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  function downloadInvoice(id, orderId) {
    toast.promise(
      api.get(`/orders/${id}/invoice`, { responseType: "blob" }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice-${orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }),
      {
        pending: 'Downloading Invoice...',
        success: 'Invoice Downloaded',
        error: 'Unable to download invoice'
      }
    );
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
    <div className="admin-orders container section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>
        <h1>Delivery Dashboard</h1>
        <p style={{ color: "#666" }}>Staff Mode: Viewing Orders for Delivery</p>
      </div>
      
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
          <div key={order._id} className="order-card" style={{ padding: "20px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h3>{order.user?.name}</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "15px" }}>
                <div>
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>Email:</strong> {order.user?.email}</p>
                    {order.shippingAddress?.phone && (
                    <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                    )}
                    <p><strong>Total Bill:</strong> <span style={{ color: "green", fontWeight: "bold" }}>₹{order.totalPrice}</span></p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase()}</p>
                    <p><strong>Order Status:</strong> <span style={{ padding: "3px 8px", background: "#f0f0f0", borderRadius: "5px" }}>{order.status}</span></p>
                </div>

                <div>
                    <p>
                        <strong>Delivery Address:</strong><br />
                        {order.shippingAddress?.houseNo}, {order.shippingAddress?.building}, {order.shippingAddress?.street}
                        {order.shippingAddress?.landmark && `, ${order.shippingAddress?.landmark}`}, {order.shippingAddress?.city}, {order.shippingAddress?.state || 'Rajasthan'} - {order.shippingAddress?.pincode}
                    </p>
                    
                    {order.location && (
                        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                            <p style={{ margin: '0 0 5px 0' }}><strong>📍 Location Provided</strong></p>
                            <a 
                                href={`https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="primary-btn"
                                style={{ display: 'inline-block', padding: '6px 12px', fontSize: '0.85em', textDecoration: 'none' }}
                            >
                                Open in Maps
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: "15px" }}>
                <p><strong>Products Ordered:</strong></p>
                <ul style={{ background: "#f9f9f9", padding: "15px 30px", borderRadius: "8px" }}>
                {order.items.map((item) => (
                    <li key={item._id} style={{ marginBottom: "5px" }}>
                    {item.product?.name} × {item.quantity} {item.color ? `(${item.color})` : ""} {item.size ? `[${item.size}]` : ""}
                    </li>
                ))}
                </ul>
            </div>

            <button
              onClick={() => downloadInvoice(order._id, order.orderId)}
              style={{
                marginTop: "15px",
                padding: "10px 15px",
                background: "#0d6efd",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📄 Download Bill / Invoice
            </button>

          </div>
        ))
      )}
    </div>
  );
}

export default StaffDashboard;
