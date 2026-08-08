import { useState, useEffect } from "react";
import api from "../services/api";
import { STORE_LOCATION } from "../config";
import "../styles/Checkout.css";
import { FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

// Haversine Formula to calculate distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function CheckoutForm({ onSubmit }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    houseNo: "",
    building: "",
    street: "",
    landmark: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
  });

  const [locationStatus, setLocationStatus] = useState("idle"); // idle, loading, success, error
  const [locationMessage, setLocationMessage] = useState("");
  const [verifiedLocation, setVerifiedLocation] = useState(null);
  const [saveAddress, setSaveAddress] = useState(true);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/users/addresses");
      setAddresses(res.data.addresses);

      const defaultAddress = res.data.addresses.find((a) => a.isDefault);
      if (defaultAddress) {
        handleAddressSelection(defaultAddress);
      } else {
        setShowManualForm(true);
      }
    } catch (err) {
      console.log(err);
      setShowManualForm(true);
    }
  };

  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
    setShowManualForm(false);
    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      houseNo: address.houseNo || "",
      building: address.building || "",
      street: address.street || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "Rajasthan",
      pincode: address.pincode || "",
    });
    setLocationStatus("idle");
    setVerifiedLocation(null);
  };

  const verifyLocation = () => {
    // Validate required address fields before location check (optional, but good UX)
    if (!form.fullName || !form.phone || !form.houseNo || !form.street || !form.city || !form.pincode) {
      setLocationStatus("error");
      setLocationMessage("Please fill all required address fields before verifying location.");
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationMessage("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("loading");
    setLocationMessage("Locating you...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = calculateDistance(
          STORE_LOCATION.latitude,
          STORE_LOCATION.longitude,
          latitude,
          longitude
        );

        if (distance <= STORE_LOCATION.maxDeliveryDistanceKm) {
          setLocationStatus("success");
          setLocationMessage("We deliver to your location.");
          setVerifiedLocation({ latitude, longitude, distance: distance.toFixed(2) });
        } else {
          setLocationStatus("error");
          setLocationMessage(`Sorry, we currently deliver only within a ${STORE_LOCATION.maxDeliveryDistanceKm} km radius of our store. (You are ${distance.toFixed(1)} km away)`);
          setVerifiedLocation(null);
        }
      },
      (error) => {
        setLocationStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationMessage("Location permission is required to verify whether we deliver to your area.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationMessage("Location information is unavailable. Please try again or check your GPS signal.");
            break;
          case error.TIMEOUT:
            setLocationMessage("The request to get your location timed out. Please try again.");
            break;
          default:
            setLocationMessage("An unknown error occurred while fetching location.");
            break;
        }
        setVerifiedLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <form
      className="checkout-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (locationStatus === "success" && verifiedLocation) {
          // Pass both form data and location data up to Checkout component
          onSubmit({ ...form, location: verifiedLocation, saveAddress });
        }
      }}
    >
      <div className="checkout-section">
        <h2>Delivery Address</h2>

        {addresses.length > 0 && (
          <div className="saved-addresses" style={{ marginBottom: '20px' }}>
            {addresses.map((item) => (
              <label key={item._id} className="saved-address" style={{ display: 'flex', gap: '10px', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '10px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={selectedAddress?._id === item._id}
                  onChange={() => handleAddressSelection(item)}
                />
                <div>
                  <strong>{item.fullName} {item.isDefault && "⭐"}</strong>
                  <p style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                    {item.houseNo}, {item.building}, {item.street}<br/>
                    {item.city}, {item.state || "Rajasthan"} - {item.pincode}
                  </p>
                </div>
              </label>
            ))}
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setShowManualForm(true);
                setSelectedAddress(null);
                setForm({
                  fullName: "", phone: "", houseNo: "", building: "", street: "", landmark: "", city: "", state: "Rajasthan", pincode: "",
                });
                setLocationStatus("idle");
                setVerifiedLocation(null);
              }}
              style={{ padding: '8px 12px', fontSize: '0.9em' }}
            >
              + Enter New Address
            </button>
          </div>
        )}

        {showManualForm && (
          <>
            <div className="input-row">
              <input
                name="fullName"
                placeholder="Full Name *"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Mobile Number *"
                value={form.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                minLength="10"
                maxLength="10"
                title="Please enter exactly 10 digits"
                required
              />
            </div>
            <div className="input-row">
              <input
                name="houseNo"
                placeholder="House / Flat Number *"
                value={form.houseNo}
                onChange={handleChange}
                required
              />
              <input
                name="building"
                placeholder="Building / Society Name *"
                value={form.building}
                onChange={handleChange}
                required
              />
            </div>
            
            <input
              name="street"
              placeholder="Street / Area *"
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
            
            <div className="input-row">
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
            </div>
            <div className="input-row">
              <input
                name="pincode"
                placeholder="PIN Code *"
                value={form.pincode}
                onChange={handleChange}
                required
              />
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px', cursor: 'pointer', fontSize: '15px' }}>
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              Save this address for next time
            </label>
          </>
        )}
      </div>

      <div className="location-verification-section">
        <button
          type="button"
          className="verify-location-btn"
          onClick={verifyLocation}
          disabled={locationStatus === "loading"}
        >
          {locationStatus === "loading" ? (
            <><FaSpinner className="spin-icon" /> Verifying...</>
          ) : (
            <><FaMapMarkerAlt /> Verify My Delivery Location</>
          )}
        </button>

        {locationStatus === "success" && (
          <div className="alert-box success">
            <FaCheckCircle className="alert-icon" />
            <div>
              <strong>Delivery Available</strong>
              <p>{locationMessage}</p>
            </div>
          </div>
        )}

        {locationStatus === "error" && (
          <div className="alert-box error">
            <FaTimesCircle className="alert-icon" />
            <div>
              <strong>Delivery Not Available</strong>
              <p>{locationMessage}</p>
            </div>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="primary-btn place-order-btn" 
        disabled={locationStatus !== "success"}
      >
        Continue to Payment
      </button>
    </form>
  );
}

export default CheckoutForm;