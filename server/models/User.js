const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
        type: String,
        default: "",
      },

      avatar: {
        type: String,
        default: "",
      },

      addresses: [
        {
          fullName: String,
          phone: String,
          houseNo: String,
          building: String,
          street: String,
          landmark: String,
          city: String,
          pincode: String,
          isDefault: {
            type: Boolean,
            default: false,
          },
        },
      ],

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);