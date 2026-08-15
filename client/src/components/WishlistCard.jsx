import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function WishlistCard({ item }) {
  const { removeFromWishlist } = useWishlist();

  const { addToCart } = useCart();

  return (
    <div className="wishlist-card">
      <img src={item.image} alt={item.name} />

      <h3>{item.name}</h3>

      <h2>₹{item.price}</h2>

      <div className="wishlist-buttons">
        <Link to={`/product/${item._id}`} className="view-btn">
          View
        </Link>

        <button className="cart-btn" onClick={() => addToCart(item)}>
          Add To Cart
        </button>
      </div>

      <button
        className="delete-btn"
        onClick={() => removeFromWishlist(item._id)}
      >
        <FaTrash />
      </button>
    </div>
  );
}

export default WishlistCard;
