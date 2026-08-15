import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const AdminSettings = () => {
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone1: "",
    phone2: "",
    address: "",
    upiId: "",
    deliveryCharge: "",
    freeDeliveryAbove: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await api.get("/settings");
      setForm(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.put("/settings", form);
      toast.success("Settings Updated");
    } catch (err) {
      console.error(err);
      toast.error("Update Failed");
    }
  }

  return (
    <div className="container mt-4">
      <h2>Shop Settings</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Shop Name"
          name="shopName"
          value={form.shopName || ""}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Owner Name"
          name="ownerName"
          value={form.ownerName || ""}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          name="email"
          value={form.email || ""}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Phone 1"
          name="phone1"
          value={form.phone1 || ""}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Phone 2"
          name="phone2"
          value={form.phone2 || ""}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Address"
          name="address"
          value={form.address || ""}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="UPI ID"
          name="upiId"
          value={form.upiId || ""}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Delivery Charge"
          name="deliveryCharge"
          value={form.deliveryCharge || ""}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Free Delivery Above"
          name="freeDeliveryAbove"
          value={form.freeDeliveryAbove || ""}
          onChange={handleChange}
        />

        <button className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
};

export default AdminSettings;
