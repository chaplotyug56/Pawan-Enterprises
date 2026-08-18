const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    shopName: { type: String, default: "Pawan Enterprises" },
    ownerName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone1: { type: String, default: "" },
    phone2: { type: String, default: "" },
    address: { type: String, default: "" },
    upiId: { type: String, default: "" },
    deliveryCharge: { type: Number, default: 0 },
    freeDeliveryAbove: { type: Number, default: 1000 },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
