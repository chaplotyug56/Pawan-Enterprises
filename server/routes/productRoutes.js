const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  addProduct,
  getProducts,
  getProductById,
  getRelatedProducts,
  getBestSellingProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// ==========================
// Public Routes
// ==========================

// Get All Products
router.get("/", getProducts);

router.get("/best-selling", getBestSellingProducts);
// Get Single Product
router.get("/:id", getProductById);

router.get("/:id/related", getRelatedProducts);

// ==========================
// Admin Protected Routes
// ==========================

// Create Product
router.post("/", protect, admin, upload.any(), addProduct);

// Update Product
router.put("/:id", protect, admin, upload.any(), updateProduct);

// Delete Product
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
