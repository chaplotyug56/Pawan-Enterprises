import {
    FaPlus,
    FaMinus,
    FaTrash,
  } from "react-icons/fa";
  import { useCart } from "../context/CartContext";
  import "../styles/CartItem.css";
  
  function CartItem({ item }) {
    const {
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
    } = useCart();
  
    return (
      <div className="cart-item">
  
        <img
          src={item.image}
          alt={item.name}
          className="cart-image"
        />
  
        <div className="cart-info">
          <h2>{item.name}</h2>
  
          <p>{item.description}</p>
  
          <h3>₹{item.price}</h3>
        </div>
  
        <div className="quantity-box">
  
          <button onClick={() => decreaseQuantity(item._id)}>
            <FaMinus />
          </button>
  
          <span>{item.quantity}</span>
  
          <button onClick={() => increaseQuantity(item._id)}>
            <FaPlus />
          </button>
  
        </div>
  
        <div className="subtotal">
          ₹{item.price * item.quantity}
        </div>
  
        <button
          className="remove-btn"
          onClick={() => removeFromCart(item._id)}
        >
          <FaTrash />
        </button>
  
      </div>
    );
  }
  
  export default CartItem;