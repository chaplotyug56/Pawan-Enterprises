import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import WishlistCard from "../components/WishlistCard";
import "../styles/Wishlist.css";

function Wishlist() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h1>❤️ Your Wishlist is Empty</h1>

        <p>Add products you love.</p>

        <Link to="/products" className="primary-btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="title">My Wishlist</h1>

      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <WishlistCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
