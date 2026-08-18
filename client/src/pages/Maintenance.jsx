import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Maintenance.css";

const Maintenance = () => {
  const navigate = useNavigate();

  return (
    <div className="maintenance-page">
      <div className="maintenance-card">
        <img 
          src="/logo.png" 
          alt="Pawan Enterprises Logo" 
          className="maintenance-logo"
        />
        <h1 className="maintenance-title">
          We'll be back soon!
        </h1>
        <p className="maintenance-text">
          Sorry for the inconvenience. We're performing some routine maintenance right now.
          We'll be back online shortly.
        </p>
        <div className="maintenance-footer">
          &mdash; The Pawan Enterprises Team
        </div>
        <div style={{ marginTop: "30px" }}>
          <button 
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              textDecoration: "underline",
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            Staff / Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
