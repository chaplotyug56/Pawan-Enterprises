import { Link } from "react-router-dom";
import { FaTruck, FaTags, FaShieldAlt } from "react-icons/fa";

import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-left">
          <span className="hero-badge">⭐ Trusted General Store</span>

          <h1>
            Everything You Need,
            <br />
            Under One Roof
          </h1>

          <p>
            Cosmetics, Grocery, Stationery, Paints, Household Essentials and
            much more at the best prices.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="primary-btn">
              Shop Now
            </Link>

            <Link to="/products" className="secondary-btn">
              Explore
            </Link>
          </div>

          <div className="hero-features">
            <div>
              <FaTruck />
              <span>Fast Delivery</span>
            </div>

            <div>
              <FaTags />
              <span>Best Prices</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Trusted Store</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="offer-card big">
            <h2>UP TO</h2>
            <h1>50%</h1>
            <p>OFF</p>
          </div>

          <div className="offer-column">
            <div className="offer-card">🎨 Paints</div>

            <div className="offer-card">🧴 Cosmetics</div>

            <div className="offer-card">📚 Stationery</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
