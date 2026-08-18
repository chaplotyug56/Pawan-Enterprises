import React from "react";
import "../styles/Maintenance.css";

const Maintenance = () => {
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
      </div>
    </div>
  );
};

export default Maintenance;
