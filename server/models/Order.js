const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
        type: String,
        unique: true,
        required: true,
      },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,

        image: String,

        price: Number,

        quantity: Number,
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },
    


    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],
        default: "Pending",
      },

      paymentMethod: {
        type: String,
        enum: ["cod", "upi"],
        default: "cod",
      },
      
      paymentStatus: {
        type: String,
        enum: [
          "Pending",
          "Pending Verification",
          "Paid",
          "Rejected",
        ],
        default: "Pending",
      },
      
      paymentScreenshot: {
        type: String,
        default: "",
      },
      
      paymentTime: {
        type: String,
        default: "",
      },
      
    
      paidAt: {
        type: Date,
        default: null,
      },
  },
  {
    timestamps: true,
  }

);

module.exports = mongoose.model("Order", orderSchema);