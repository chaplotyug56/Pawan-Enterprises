import {
    FaTruck,
    FaWhatsapp,
    FaShieldAlt,
    FaMoneyBillWave,
  } from "react-icons/fa";
  
  import "../styles/WhyChooseUs.css";
  
  function WhyChooseUs() {
    return (
      <section className="why-section">
  
        <div className="container">
  
          <h2>Why Shop With Pawan Enterprises?</h2>
  
          <p className="why-subtitle">
            Trusted by local families for quality products and reliable service.
          </p>
  
          <div className="why-grid">
  
            <div className="why-card">
              <FaTruck className="why-icon" />
  
              <h3>One Day Delivery in Akola</h3>
  
              <p>
                Fast local one-day delivery. Free delivery on orders above ₹1000.
              </p>
            </div>
  
            <div className="why-card">
              <FaMoneyBillWave className="why-icon" />
  
              <h3>Secure UPI Payment</h3>
              <p>
                Pay securely and quickly using any UPI app before delivery.
              </p>
            </div>
  
            <div className="why-card">
              <FaShieldAlt className="why-icon" />
  
              <h3>100% Genuine Products</h3>
  
              <p>
                We sell trusted brands with quality you can rely on.
              </p>
            </div>
  
            <div className="why-card">
              <FaWhatsapp className="why-icon" />
  
              <h3>WhatsApp Support</h3>
  
              <p>
                Need help choosing a product? Chat with us anytime.
              </p>
            </div>
  
          </div>
  
        </div>
  
      </section>
    );
  }
  
  export default WhyChooseUs;