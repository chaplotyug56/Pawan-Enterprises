import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";

function BestSelling() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products/best-selling");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section className="container section">

      <h2 className="section-title">
        🔥 Most Popular Products
      </h2>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

    </section>
  );
}

export default BestSelling;