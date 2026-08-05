const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

router.get("/", getNotifications);

router.put("/:id/read", markAsRead);

router.put("/read-all", markAllAsRead);

module.exports = router;