const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ========================================
// Register User
// ========================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const userExists = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone: phone }
      ]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: userData,
    });

  } catch (error) {
    console.error("Register Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Login User
// ========================================
const loginUser = async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    
    // Support both old 'email' payload and new 'identifier' payload
    const loginId = identifier || email;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email/phone and password",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: loginId.toLowerCase() },
        { phone: loginId }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: userData,
    });

  } catch (error) {
    console.error("Login Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Firebase Login / Auth
// ========================================
const firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: "Firebase token is required" });
    }

    const firebaseConfig = require("../config/firebase");
    if (!firebaseConfig.auth) {
      return res.status(500).json({ success: false, message: firebaseConfig.initializationError });
    }

    // Verify token
    const decodedToken = await firebaseConfig.auth.verifyIdToken(token);
    const { email, name, picture, phone_number, uid } = decodedToken;

    let userEmail = email ? email.toLowerCase() : `${uid}@firebase.local`;

    // Check if user exists
    let user = await User.findOne({
      $or: [
        { email: userEmail },
        { phone: phone_number || uid }
      ]
    });

    if (!user) {
      // Create user if they don't exist
      user = await User.create({
        name: name || "Firebase User",
        email: userEmail,
        password: await bcrypt.hash(uid + process.env.JWT_SECRET, 10), // Random password
        phone: phone_number || "N/A",
      });
    }

    // Generate local JWT
    const localToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Firebase Login Successful",
      token: localToken,
      user: userData,
    });

  } catch (error) {
    console.error("Firebase Login Error:", error);
    if (res.headersSent) return;
    return res.status(500).json({
      success: false,
      message: error.message || "Invalid Firebase Token",
    });
  }
};

// ========================================
// Get Profile
// ========================================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Update Profile
// ========================================
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: userData,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Change Password
// ========================================
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });

  } catch (error) {
    console.error("Change Password Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ========================================
// Add Address
// ========================================
const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      houseNo,
      building,
      street,
      landmark,
      city,
      state,
      pincode,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !houseNo ||
      !street ||
      !city ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all address fields",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.addresses.push({
      fullName,
      phone,
      houseNo,
      building,
      street,
      landmark,
      city,
      state,
      pincode,
      isDefault: user.addresses.length === 0,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address Added Successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error("Add Address Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Get Addresses
// ========================================
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      addresses: user.addresses,
    });

  } catch (error) {
    console.error("Get Addresses Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Delete Address
// ========================================
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== req.params.id
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address Deleted Successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error("Delete Address Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Update Address
// ========================================
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    address.fullName = req.body.fullName || address.fullName;
    address.phone = req.body.phone || address.phone;
    address.houseNo = req.body.houseNo || address.houseNo;
    address.building = req.body.building || address.building;
    address.street = req.body.street || address.street;
    address.landmark = req.body.landmark || address.landmark;
    address.city = req.body.city || address.city;
    address.state = req.body.state || address.state;
    address.pincode = req.body.pincode || address.pincode;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address Updated Successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error("Update Address Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Set Default Address
// ========================================
const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const selectedAddress = user.addresses.id(req.params.id);

    if (!selectedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses.forEach((address) => {
      address.isDefault =
        address._id.toString() === req.params.id;
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Default Address Updated",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error("Set Default Address Error:", error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Export Controllers
// ========================================
module.exports = {
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
  firebaseLogin,
};