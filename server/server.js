process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes = require("./routes/reviewRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const imageRoutes = require("./routes/imageRoutes");
const multer = require("multer");

require("dotenv").config();

const app = express();
app.set("trust proxy", 1);

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://pawan-enterprises-9nkmai8r3-pawan-enterprises.vercel.app",
  "https://pawan-enterprises-mu.vercel.app",
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
  }),
);
app.options(/(.*)/, cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use((req, res, next) => {
  if (!process.env.MONGODB_URI) {
    return res
      .status(500)
      .send(
        "<h2>CRITICAL ERROR: MONGODB_URI missing!</h2><p>Please add MONGODB_URI in Vercel Settings -> Environment Variables.</p>",
      );
  }
  if (mongoose.connection.readyState === 0) {
    // If not connected, don't let it buffer forever and timeout Vercel
    return res
      .status(500)
      .send(
        "<h2>CRITICAL ERROR: MongoDB is not connected.</h2><p>Your MONGODB_URI in Vercel is invalid, or the MongoDB Atlas IP Whitelist is blocking the connection. Make sure 0.0.0.0/0 is added in MongoDB Atlas.</p>",
      );
  }
  next();
});

app.use("/api/products", productRoutes);
console.log("✅ Product routes loaded");
app.use("/api/users", userRoutes);
console.log("✅ User routes loaded");
app.use("/api/orders", orderRoutes);
console.log("✅ Order routes loaded");
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/images", imageRoutes);

// Connect MongoDB
const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("No MONGODB_URI found in environment variables!");
    }

    // Automatically strip quotes in case the user accidentally pasted them in Vercel
    uri = uri.replace(/^["']|["']$/g, "").trim();

    // In serverless environments, avoid re-connecting if already connected
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      family: 4, // Force IPv4, because Node 18+ prefers IPv6 which can cause 90s connection hangs with MongoDB Atlas
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err.message);
  }
};
connectDB();

// Home Route
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="background-color: #1a1a1a; color: #ffffff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
        <h1 style="font-size: 3rem;">🚀 Welcome to Pawan Enterprises Backend!</h1>
      </body>
    </html>
  `);
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
// Start Server
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
