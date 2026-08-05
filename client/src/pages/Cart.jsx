import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

function Cart() {

  const { cart } = useCart();

  if (cart.length === 0) {
    return (

      <div className="empty-cart">

        <h1>Your Cart is Empty</h1>

        <p>
          Looks like you haven't added
          anything yet.
        </p>

        <Link
          to="/products"
          className="primary-btn"
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

          <CartItem
            key={item._id}
            item={item}
          />

        ))}

      </div>

      <OrderSummary />

    </div>

  );

}

export default Cart;