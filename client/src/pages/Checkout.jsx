import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CheckoutForm from "../components/CheckoutForm";
import PaymentMethods from "../components/PaymentMethods";
import OrderSummary from "../components/OrderSummary";

import { useCart } from "../context/CartContext";

import api from "../services/api";
import UPIPayment from "../components/UPIPayment";
import "../styles/Checkout.css";
function Checkout() {
  const navigate = useNavigate();

  const { cart, cartTotal, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState(null);
  const [location, setLocation] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const [payment, setPayment] = useState("upi");

  const [paymentTime, setPaymentTime] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const shipping = cartTotal >= 1000 ? 0 : 20;
  const totalAmount = cartTotal + shipping;
  
  const continueCheckout = (data) => {
    const { location: verifiedLocation, saveAddress, ...addressData } = data;
    setShippingAddress({ ...addressData, saveAddress });
    setLocation(verifiedLocation);
    setShowPayment(true);
    toast.success("Delivery Address & Location Verified!");
    setTimeout(() => {
      window.scrollBy({ top: 500, behavior: "smooth" });
    }, 100);
  };

  const placeOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    console.log("🚀 Place Order Clicked");
    try {
      if (!shippingAddress) {
        return toast.error("Please add a shipping address");
      }
      if (!location) {
        return toast.error("Please verify your location");
      }
      let finalPaymentTime = paymentTime;
      if (payment === "upi" && !finalPaymentTime) {
         const now = new Date();
         const hours = String(now.getHours()).padStart(2, "0");
         const minutes = String(now.getMinutes()).padStart(2, "0");
         finalPaymentTime = `${hours}:${minutes}`;
         setPaymentTime(finalPaymentTime);
      }

      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        color: item.color || "",
        size: item.size || ""
      }));


      const data = new FormData();

      const { saveAddress, ...finalAddress } = shippingAddress;

      // Save the address for next time if the user checked the box
      if (saveAddress) {
        try {
          await api.post("/users/addresses", finalAddress);
        } catch (err) {
          console.error("Failed to save address:", err);
          // We don't want to block the order if saving address fails
        }
      }

      data.append("items", JSON.stringify(items));
      data.append("shippingAddress", JSON.stringify(finalAddress));
      data.append("location", JSON.stringify(location));
      data.append("paymentMethod", payment);
      data.append("paymentTime", finalPaymentTime);

      if (paymentScreenshot) {
        data.append("paymentScreenshot", paymentScreenshot);
      }

      console.log("Sending request...");
      const res = await api.post("/orders", data);
      console.log("Response:", res.data);

      if (res.data.success) {
        clearCart();

        toast.success("Order Placed Successfully");

        navigate("/my-orders");
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Order Failed"
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page container section">

      <div>

        <CheckoutForm
          onSubmit={continueCheckout}
        />

        {showPayment && (
          <>

            <PaymentMethods
              payment={payment}
              setPayment={setPayment}
            />
            {payment === "upi" && (
  <UPIPayment
    totalAmount={totalAmount}
    paymentTime={paymentTime}
    setPaymentTime={setPaymentTime}
    paymentScreenshot={paymentScreenshot}
    setPaymentScreenshot={setPaymentScreenshot}
  />
)}

            <button
              className="primary-btn"
              style={{ marginTop: "20px" }}
              onClick={placeOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>

          </>
        )}

      </div>

      <OrderSummary hideButton />

    </div>
  );
}

export default Checkout;