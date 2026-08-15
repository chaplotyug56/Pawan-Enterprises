const NotificationToken = require("../models/NotificationToken");

// ========================================
// Save or Update FCM Token
// ========================================
const saveToken = async (req, res) => {
  try {
    const { token, deviceInfo } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });
    }

    // Check if token already exists
    let existingToken = await NotificationToken.findOne({ token });

    if (existingToken) {
      // If it exists, make sure it's active and assigned to current admin
      existingToken.adminId = req.user._id;
      existingToken.isActive = true;
      if (deviceInfo) existingToken.deviceInfo = deviceInfo;
      await existingToken.save();
    } else {
      // Create new token
      await NotificationToken.create({
        token,
        adminId: req.user._id,
        deviceInfo: deviceInfo || "Web Browser",
        isActive: true,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Token saved successfully" });
  } catch (error) {
    console.error("Save Token Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========================================
// Deactivate/Revoke Token (on logout)
// ========================================
const removeToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });
    }

    await NotificationToken.findOneAndUpdate({ token }, { isActive: false });

    return res
      .status(200)
      .json({ success: true, message: "Token removed successfully" });
  } catch (error) {
    console.error("Remove Token Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const firebaseAdmin = require("../config/firebase");

// ========================================
// Test FCM Configuration
// ========================================
const testNotification = async (req, res) => {
  try {
    if (!firebaseAdmin) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            "Firebase Admin SDK is not initialized. Environment variables are likely missing or incorrect.",
        });
    }

    const adminTokens = await NotificationToken.find({ isActive: true });

    if (adminTokens.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "No active notification tokens found in database. Click 'Enable Notifications' in Admin Dashboard first.",
        });
    }

    const payload = {
      notification: {
        title: "🧪 Test Notification",
        body: "If you see this, Firebase Cloud Messaging is working perfectly!",
      },
      tokens: adminTokens.map((t) => t.token),
    };

    const response = await firebaseAdmin
      .messaging()
      .sendEachForMulticast(payload);

    return res.status(200).json({
      success: true,
      message: "Test completed",
      result: response,
    });
  } catch (error) {
    console.error("Test Notification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  saveToken,
  removeToken,
  testNotification,
};
