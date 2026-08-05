import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/OrderSummary.css";

function OrderSummary({ hideButton = false }) {

  const { cartTotal } = useCart();

  const shipping =
    cartTotal > 1000 ? 0 : 80;

  const gst = Math.round(cartTotal * 0.18);

  const total =
    cartTotal + shipping + gst;

  return (

    <div className="summary">

      <h2>Order Summary</h2>

      <div>

        <span>Subtotal</span>

        <span>₹{cartTotal}</span>

      </div>

      <div>

        <span>Shipping</span>

        <span>

          {shipping === 0
            ? "FREE"
            : `₹${shipping}`}

        </span>

      </div>

      <div>

        <span>GST</span>

        <span>₹{gst}</span>

      </div>

      <hr />

      <div className="grand">

        <span>Total</span>

        <span>₹{total}</span>

      </div>

      {!hideButton && (
  <Link to="/checkout">
    <button className="checkout-btn">
      Proceed to Checkout
    </button>
  </Link>
)}

    </div>

  );

}

export default OrderSummary;