import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "../styles/CartItem.css";

function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-image" />

      <div className="cart-info">
        <h2>{item.name}</h2>

        {item.color || item.size ? (
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
            {item.color && <span>Color: {item.color} </span>}
            {item.size && <span>Size: {item.size}</span>}
          </p>
        ) : (
          <p>{item.description}</p>
        )}

        <h3>₹{item.price}</h3>
      </div>

      <div className="quantity-box">
        <button onClick={() => decreaseQuantity(item.cartItemId || item._id)}>
          <FaMinus />
        </button>

        <span>{item.quantity}</span>

        <button onClick={() => increaseQuantity(item.cartItemId || item._id)}>
          <FaPlus />
        </button>
      </div>

      <div className="subtotal">₹{item.price * item.quantity}</div>

      <button
        className="remove-btn"
        onClick={() => removeFromCart(item.cartItemId || item._id)}
      >
        <FaTrash />
      </button>
    </div>
  );
}

export default CartItem;
