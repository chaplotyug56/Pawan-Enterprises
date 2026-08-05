import { useEffect, useState } from "react";
import api from "../../services/api";

function RecentOrders() {
  const [orders, setOrders] = useState([]);

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
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.orderId || order._id.slice(-6).toUpperCase()}</td>

              <td>{order.user?.name}</td>

              <td>₹{order.totalPrice}</td>

              <td>
                <span className={statusClass(order.status)}>
                  {order.status}
                </span>
              </td>

              <td>
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentOrders;