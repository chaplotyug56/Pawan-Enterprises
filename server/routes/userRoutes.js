const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    addAddress,
    getAddresses,
    deleteAddress,
    updateAddress,
    setDefaultAddress,
  } = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

router.get("/addresses", protect, getAddresses);

router.post("/addresses", protect, addAddress);

router.delete("/addresses/:id", protect, deleteAddress);

router.put("/addresses/:id", protect, updateAddress);

router.put(
    "/addresses/:id/default",
    protect,
    setDefaultAddress
  );

module.exports = router;