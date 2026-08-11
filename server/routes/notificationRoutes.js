const express = require("express");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

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
router.post("/token", isAuthenticatedUser, authorizeRoles("admin"), saveToken);
router.post("/token/remove", isAuthenticatedUser, authorizeRoles("admin"), removeToken);

module.exports = router;