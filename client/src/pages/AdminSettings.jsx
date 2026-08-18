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
    maintenanceMode: false,
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({
      ...form,
      [e.target.name]: value,
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

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mt-3">
        <div className="mb-4 p-3 bg-light rounded border border-danger">
          <h5 className="text-danger">⚠️ Danger Zone</h5>
          <div className="form-check form-switch mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={form.maintenanceMode || false}
              onChange={handleChange}
            />
            <label className="form-check-label fw-bold text-danger" htmlFor="maintenanceMode">
              Enable Maintenance Mode (Blocks public access to the website)
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Shop Name</label>
            <input
              className="form-control"
              placeholder="Shop Name"
              name="shopName"
              value={form.shopName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Owner Name</label>
            <input
              className="form-control"
              placeholder="Owner Name"
              name="ownerName"
              value={form.ownerName || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              placeholder="Email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Phone 1</label>
            <input
              className="form-control"
              placeholder="Phone 1"
              name="phone1"
              value={form.phone1 || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Phone 2</label>
            <input
              className="form-control"
              placeholder="Phone 2"
              name="phone2"
              value={form.phone2 || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            placeholder="Address"
            name="address"
            value={form.address || ""}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">UPI ID</label>
            <input
              className="form-control"
              placeholder="UPI ID"
              name="upiId"
              value={form.upiId || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Delivery Charge</label>
            <input
              className="form-control"
              placeholder="Delivery Charge"
              name="deliveryCharge"
              value={form.deliveryCharge || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Free Delivery Above</label>
            <input
              className="form-control"
              placeholder="Free Delivery Above"
              name="freeDeliveryAbove"
              value={form.freeDeliveryAbove || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3">Save Settings</button>
      </form>
    </div>
  );
};

export default AdminSettings;
