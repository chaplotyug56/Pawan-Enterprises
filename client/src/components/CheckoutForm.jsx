import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Checkout.css";

function CheckoutForm({ onSubmit }) {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showManualForm, setShowManualForm] = useState(false);
    
    const [form, setForm] = useState({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };
  useEffect(() => {
    fetchAddresses();
  }, []);
  
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/users/addresses");
  
      setAddresses(res.data.addresses);
  
      const defaultAddress = res.data.addresses.find(
        (a) => a.isDefault
      );
  
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        setShowManualForm(false);
      } else {
        setShowManualForm(true);
      }
    } catch (err) {
      console.log(err);
      setShowManualForm(true);
    }
  };

  return (
    <form
      className="checkout-form"
      onSubmit={(e) => {
        e.preventDefault();
        const currentPincode = selectedAddress && !showManualForm ? selectedAddress.pincode : form.pincode;
        if (currentPincode.trim() !== "312205") {
          alert("Sorry, we currently only deliver to pincode 312205. Your area is not deliverable at the moment.");
          return;
        }
        if (selectedAddress && !showManualForm) {
            onSubmit(selectedAddress);
          } else {
            onSubmit(form);
          }
      }}
    >
      <h2>Select Delivery Address</h2>

      {addresses.length > 0 && (
  <div className="saved-addresses">

    {addresses.map((item) => (
      <label
        key={item._id}
        className="saved-address"
      >
        <input
          type="radio"
          checked={
            selectedAddress?._id === item._id
          }
          onChange={() => {
            setSelectedAddress(item);
            setShowManualForm(false);
          }}
        />

        <div>

          <strong>
            {item.fullName}

            {item.isDefault && " ⭐ Default"}

          </strong>

          <p>{item.phone}</p>

          <p>{item.address}</p>

          <p>
            {item.city}, {item.state}
          </p>

          <p>{item.pincode}</p>

        </div>

      </label>
    ))}

    <button
      type="button"
      className="secondary-btn"
      onClick={() => {
        setShowManualForm(true);
        setSelectedAddress(null);
      }}
    >
      + Use New Address
    </button>

  </div>
)}

{showManualForm && (
  <>
    <input
      name="fullName"
      placeholder="Full Name"
      value={form.fullName}
      onChange={handleChange}
      required
    />

    <input
      name="phone"
      placeholder="Phone Number"
      value={form.phone}
      onChange={handleChange}
      required
    />

    <input
      name="email"
      placeholder="Email (Optional)"
      value={form.email}
      onChange={handleChange}
    />

    <textarea
      name="address"
      placeholder="Address"
      value={form.address}
      onChange={handleChange}
      required
    />

    <div className="row">

      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        required
      />

      <input
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
        required
      />

    </div>

    <input
      name="pincode"
      placeholder="PIN Code"
      value={form.pincode}
      onChange={handleChange}
      required
    />
  </>
)}

<button className="primary-btn">
  Continue
</button>
    </form>
  );
}

export default CheckoutForm;