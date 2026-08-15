import { useEffect, useState } from "react";
import api from "../../services/api";

function RecentOrders() {
  const [orders, setOrders] = useState([]);

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  async function fetchRecentOrders() {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function statusClass(status) {
    switch (status) {
      case "Delivered":
        return "status-delivered";
      case "Shipped":
        return "status-shipped";
      case "Processing":
        return "status-processing";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  }

  const displayedOrders = showAll ? orders : orders.slice(0, 5);

  return (
    <div className="recent-orders">
      <h2>Recent Orders</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {displayedOrders.map((order) => (
            <tr key={order._id}>
              <td>{order.orderId || order._id.slice(-6).toUpperCase()}</td>
              <td>{order.user?.name}</td>
              <td>₹{order.totalPrice}</td>
              <td>
                <span className={statusClass(order.status)}>
                  {order.status}
                </span>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length > 5 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: "10px 20px",
              background: "#1565C0",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;
