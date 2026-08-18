import React from "react";

const Maintenance = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}
    >
      <div
        className="card shadow-lg p-5 border-0 rounded-4"
        style={{ maxWidth: "600px", width: "100%", backgroundColor: "white" }}
      >
        <div className="mb-4">
          <i
            className="bi bi-tools text-primary"
            style={{ fontSize: "5rem" }}
          ></i>
        </div>
        <h1 className="fw-bold text-dark mb-3" style={{ fontSize: "2.5rem" }}>
          We'll be back soon!
        </h1>
        <p className="text-muted fs-5 mb-4">
          Sorry for the inconvenience. We're performing some maintenance right now.
          We'll be back online shortly.
        </p>
        <div className="mt-2 text-secondary">
          &mdash; The Pawan Enterprises Team
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
