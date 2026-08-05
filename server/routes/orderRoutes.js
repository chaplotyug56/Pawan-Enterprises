const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  downloadInvoice,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.post(
  "/",
  protect,
  upload.single("paymentScreenshot"),
  createOrder
);

// User Orders
router.get("/", protect, getOrders);

// Admin
router.get("/all", protect, admin, getAllOrders);
router.get(
  "/:id/invoice",
  protect,
  downloadInvoice
);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;