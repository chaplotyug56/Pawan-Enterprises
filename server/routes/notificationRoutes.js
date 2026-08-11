const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const {
  saveToken,
  removeToken,
} = require("../controllers/notificationTokenController");

router.get("/", getNotifications);

router.put("/:id/read", markAsRead);

router.put("/read-all", markAllAsRead);

// FCM Token Management
router.post("/token", protect, admin, saveToken);
router.post("/token/remove", protect, admin, removeToken);

module.exports = router;