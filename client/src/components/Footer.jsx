import {
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaEnvelope,
  } from "react-icons/fa";
  
  import "../styles/Footer.css";
  
  function Footer() {
    return (
      <footer className="footer">
  
        <div className="footer-container">
  
          {/* Company */}
  
          <div className="footer-section">
            <h2>Pawan Enterprises</h2>
  
            <p>
              Your trusted general store for Cosmetics, Grocery,
              Stationery, Paints and Household Essentials.
            </p>
          </div>
  
          {/* Contact */}
  
          <div className="footer-section">
  
            <h3>Contact Us</h3>
  
            <p>
              <FaMapMarkerAlt />
              &nbsp; Akola, Chittaurgarh (Rajasthan)
            </p>
  
            <p>
              <FaPhoneAlt />
              &nbsp; <a href="tel:+919929119290" style={{ display: "inline", color: "inherit", textDecoration: "none" }}>+91 9929119290</a>
            </p>
  
            <p>
              <FaEnvelope />
              &nbsp; pawanenterprisesakola@gmail.com
            </p>
  
          </div>
  
          {/* Quick Links */}
  
          <div className="footer-section">
  
            <h3>Quick Links</h3>
  
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/cart">Cart</a>
            <a href="/login">Login</a>
  
          </div>
  

  
        </div>
  
        <div className="copyright">
  
          © 2026 Pawan Enterprises. All Rights Reserved.
  
        </div>
  
      </footer>
    );
  }
  
  export default Footer;
