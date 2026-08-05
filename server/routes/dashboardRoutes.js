const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

router.get("/", protect, admin, getDashboardStats);

module.exports = router;