import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

function Cart() {
  const { cart } = useCart();

  if (cart.length === 0) {
    return (
      <div
        className="empty-cart container section"
        style={{
          textAlign: "center",
          padding: "80px 20px",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "15px" }}>
          Your Cart is Empty
        </h1>

        <p style={{ color: "#666", fontSize: "1.2rem", marginBottom: "30px" }}>
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/products"
          className="primary-btn"
          style={{ padding: "15px 30px", fontSize: "1.1rem" }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container section">
      <div className="cart-list">
        {cart.map((item) => (
          <CartItem key={item.cartItemId || item._id} item={item} />
        ))}
      </div>

      <OrderSummary />
    </div>
  );
}

export default Cart;
