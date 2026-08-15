import { getRecentlyViewed } from "../services/recentlyViewed";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import "../styles/RecentlyViewed.css";

function RecentlyViewed() {
  const { addToCart } = useCart();

  const products = getRecentlyViewed();

  if (products.length === 0) return null;

  return (
    <section className="recently-viewed section">
      <div className="container">
        <div className="section-title">
          <h2>Recently Viewed</h2>
          <p>Your recently viewed products</p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentlyViewed;
