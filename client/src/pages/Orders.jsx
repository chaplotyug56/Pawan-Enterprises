import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

import "../styles/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await api.get("/orders");

      setOrders(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/orders/${id}`, { status });

      toast.success("Order updated");

      fetchOrders();
    } catch (err) {
      toast.error("Unable to update order");
    }
  }

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
        pending: "Downloading Invoice...",
        success: "Invoice Downloaded",
        error: "Unable to download invoice",
      },
    );
  }

  if (loading) {
    return <h2>Loading Orders...</h2>;
  }

  return (
    <div className="orders-page">
      <h1>Orders</h1>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
            <th>Invoice</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.orderId || order._id.slice(-6).toUpperCase()}</td>

              <td>{order.user?.name}</td>

              <td>₹{order.totalPrice}</td>
              <td>{order.status}</td>

              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option>Pending</option>

                  <option>Processing</option>

                  <option>Shipped</option>

                  <option>Delivered</option>

                  <option>Cancelled</option>
                </select>

                <td>
                  <button
                    className="primary-btn"
                    onClick={() => downloadInvoice(order._id, order.orderId)}
                  >
                    Download
                  </button>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
