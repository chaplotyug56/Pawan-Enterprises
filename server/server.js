const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes =  require("./routes/reviewRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const multer = require("multer");

require("dotenv").config();

const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://pawan-enterprises-9nkmai8r3-pawan-enterprises.vercel.app",
    "https://pawan-enterprises-mu.vercel.app"
  ];
  
  app.use(

    cors({
      origin: function (origin, callback) {
        if (
          !origin ||
          origin.startsWith("http://localhost") ||
          origin.endsWith(".vercel.app")
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
  app.options("*", cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/products", productRoutes);
console.log("✅ Product routes loaded");
app.use("/api/users", userRoutes);
console.log("✅ User routes loaded");
app.use("/api/orders", orderRoutes);
console.log("✅ Order routes loaded");
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err.message);
  });

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Welcome to Pawan Enterprises Backend!");
});
// ========================================
// Global Error Handler
// ========================================
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
  
    if (res.headersSent) {
      return next(err);
    }
  
    if (err instanceof multer.MulterError) {
      let message = err.message;
  
      if (err.code === "LIMIT_FILE_SIZE") {
        message = "Image size must not exceed 5 MB.";
      }
  
      return res.status(400).json({
        success: false,
        message,
      });
    }
  
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });
// Server Port
const PORT = process.env.PORT || 8000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});