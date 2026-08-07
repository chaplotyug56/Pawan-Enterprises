import { Link } from "react-router-dom";
import "../styles/HeroBanner.css";
import banner from "../assets/PHOTO-2026-08-08-02-04-54.jpg";

function HeroBanner() {
  return (
    <section
    className="hero-banner"
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${banner})`,
    }}
  >

      <div className="hero-overlay">

        <h1>Pawan Enterprises</h1>

        <h2>Your One Stop Shop for Daily Essentials</h2>

        <p>
          Grocery • Paints • Cosmetics • Stationery • Household Items
        </p>

        <div className="hero-buttons">

          <Link to="/products" className="shop-btn">
            Shop Now
          </Link>

          <a
            href="https://wa.me/918209707984?text=Hello%20Pawan%20Enterprises"
            target="_blank"
            rel="noopener noreferrer"
            className="call-btn"
          >
            💬 Chat Now
          </a>

        </div>

      </div>

    </section>
  );
}

export default HeroBanner;