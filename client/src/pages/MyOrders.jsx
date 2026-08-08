import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import "../styles/MyOrders.css";

const orderSteps = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];
function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
        const res = await api.get("/orders");

      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
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
      link.download = `Invoice-${orderId}.pdf`;
  
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Unable to download invoice");
    }
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <h3>No Orders Yet</h3>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <h3>Order #{order.orderId}</h3>

              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="order-info">

  <div>
    <strong>Total</strong>
    <p>₹{order.totalPrice}</p>
  </div>

  <div>
    <strong>Items</strong>
    <p>{order.items.length}</p>
  </div>

  

  <div>
    <strong>Date</strong>
    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
  </div>

</div>

<div className="shipping-card">
  <h4>📍 Shipping Address</h4>

  <div className="shipping-details">
  <p><strong>{order.shippingAddress.fullName}</strong></p>

  <p>{order.shippingAddress.phone}</p>

  <p>{order.shippingAddress.address}</p>

  <p>
    {order.shippingAddress.city}, {order.shippingAddress.state}
  </p>

  <p>{order.shippingAddress.pincode}</p>
</div>
</div>

            <div className="order-timeline">
  {orderSteps.map((step, index) => {
    const currentIndex = orderSteps.indexOf(order.status);

    return (
      <div
        key={step}
        className={`timeline-step ${
          index <= currentIndex ? "active" : ""
        }`}
      >
        <div className="circle"></div>
        <span>{step}</span>
      </div>
    );
  })}
</div>
<button
  className="primary-btn"
  onClick={() => downloadInvoice(order._id, order.orderId)}
>
  📄 Download Invoice
</button>

            <h4>Products</h4>

            {order.items.map((item) => (
              <div className="order-item" key={item.product}>
                <img
                  src={
                    item.image.startsWith("http") || item.image.startsWith("data:")
                      ? item.image
                      : `//${window.location.host.includes("localhost") ? "localhost:8000" : "pawan-enterprises.onrender.com"}/api/images/${item.image}`
                  }
                  alt={item.name}
                />

<div className="order-item-details">
  <h4>{item.name}</h4>

  <div className="order-item-meta">
    <span className="price">₹{item.price}</span>

    <span className="quantity">
      Qty: {item.quantity}
    </span>
  </div>
</div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;