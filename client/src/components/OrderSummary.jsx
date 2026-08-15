import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/OrderSummary.css";

function OrderSummary({ hideButton = false }) {
  const { cartTotal } = useCart();

  const shipping = cartTotal >= 1000 ? 0 : 20;
  const totalAmount = cartTotal + shipping;

  return (
    <div className="summary">
      <h2>Order Summary</h2>

      <div>
        <span>Subtotal</span>

        <span>₹{cartTotal}</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
      </div>

      <div className="summary-row total">
        <span>Total</span>

        <span>₹{totalAmount}</span>
      </div>

      {!hideButton && (
        <Link to="/checkout">
          <button className="checkout-btn">Proceed to Checkout</button>
        </Link>
      )}
    </div>
  );
}

export default OrderSummary;
