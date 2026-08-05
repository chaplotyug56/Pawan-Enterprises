import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";

import "../styles/FeaturedProducts.css";

function FeaturedProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {

    api
    .get("/products")
      .then((res) => {
        setProducts(res.data.data.slice(0, 8));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  return (

    <section className="featured section">

      <div className="container">

        <div className="featured-header">

          <div>

            <h2 className="title">
              Featured Products
            </h2>

            <p className="subtitle">
              Best Selling Products
            </p>

          </div>

          <Link
            to="/products"
            className="primary-btn"
          >
            View All
          </Link>

        </div>

        {loading ? (

          <div className="loading-grid">

            {[1,2,3,4].map((item)=>(

              <div
                key={item._id}
                className="loading-card"
              />

            ))}

          </div>

        ) : (

          <div className="featured-grid">

            {products.map(product=>(

              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />

            ))}

          </div>

        )}

      </div>

    </section>

  );

}

export default FeaturedProducts;