import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Addresses.css";

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);

const emptyForm = {
  fullName: "",
  phone: "",
  houseNo: "",
  building: "",
  street: "",
  landmark: "",
  city: "",
  state: "Rajasthan",
  pincode: "",
};
const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/users/addresses");
      setAddresses(res.data.addresses);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addAddress = async (e) => {
    e.preventDefault();
    
    if (form.pincode.trim() !== "312205") {
      alert("Sorry, we currently only deliver to pincode 312205. Your area is not deliverable at the moment.");
      return;
    }
  
    try {
      if (editingId) {
        await api.put(`/users/addresses/${editingId}`, form);
        alert("Address Updated Successfully");
      } else {
        await api.post("/users/addresses", form);
        alert("Address Added Successfully");
      }
  
      setForm(emptyForm);
      setEditingId(null);
  
      fetchAddresses();
  
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  const removeAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    await api.delete(`/users/addresses/${id}`);

    fetchAddresses();
  };
  const makeDefault = async (id) => {
    try {
      await api.put(`/users/addresses/${id}/default`);
  
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to set default address");
    }
  };

  const editAddress = (address) => {
    setEditingId(address._id);
  
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      houseNo: address.houseNo,
      building: address.building,
      street: address.street,
      landmark: address.landmark,
      city: address.city,
      state: address.state || "Rajasthan",
      pincode: address.pincode,
    });
  
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="addresses-page">
     <h2>
  {editingId ? "Edit Address" : "Saved Addresses"}
</h2>

      <form onSubmit={addAddress} className="address-form">
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          minLength="10"
          maxLength="10"
          title="Please enter exactly 10 digits"
          required
        />

        <input
          name="building"
          placeholder="Building / Society Name (Optional)"
          value={form.building}
          onChange={handleChange}
        />

        <input
          name="street"
          placeholder="Street / Area"
          value={form.street}
          onChange={handleChange}
          required
        />

        <input
          name="landmark"
          placeholder="Landmark (Optional)"
          value={form.landmark}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="Village *"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          readOnly
          style={{ backgroundColor: '#f5f5f5', color: '#666' }}
          required
        />

        <input
          name="pincode"
          placeholder="PIN Code"
          value={form.pincode}
          onChange={handleChange}
          required
        />

<button type="submit">
  {editingId ? "Update Address" : "Add Address"}
</button>
      </form>

      <div className="address-list">
        {addresses.map((item) => (
          <div key={item._id} className="address-card">
            <h4>
  {item.fullName}

  {item.isDefault && (
    <span
      style={{
        marginLeft: 10,
        color: "green",
        fontSize: "14px",
      }}
    >
      ⭐ Default
    </span>
  )}
</h4>

            <p>{item.phone}</p>

            <p>{item.houseNo}, {item.building}, {item.street}</p>

            <p>
              {item.landmark && `${item.landmark}, `}{item.city} - {item.pincode}
            </p>

            <div style={{ marginTop: "10px" }}>
  {!item.isDefault && (
    <button
      onClick={() => makeDefault(item._id)}
      style={{ marginRight: "10px" }}
    >
      Set Default
    </button>
  )}

  <button
    onClick={() => editAddress(item)}
    style={{ marginRight: "10px" }}
  >
    Edit
  </button>

  <button onClick={() => removeAddress(item._id)}>
    Delete
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Addresses;