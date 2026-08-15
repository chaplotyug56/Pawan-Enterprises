const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
  },

  subCategory: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  mrp: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  gstPercent: {
    type: Number,
    default: 0,
  },

  stock: {
    type: Number,
    default: 0,
  },

  lowStockThreshold: {
    type: Number,
    default: 5,
  },

  allowOutOfStockPurchase: {
    type: Boolean,
    default: false,
  },

  image: {
    type: String,
    default: "",
  },

  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    default: "",
  },

  size: {
    type: String,
    default: "",
  },

  unit: {
    type: String,
    default: "",
  },

  weight: {
    type: Number,
    default: 0,
  },

  manufacturer: {
    type: String,
    default: "",
  },

  countryOfOrigin: {
    type: String,
    default: "",
  },

  expiryDate: {
    type: String,
    default: "",
  },

  productType: {
    type: String,
    default: "",
  },

  sku: {
    type: String,
    default: "",
  },

  featured: {
    type: Boolean,
    default: false,
  },

  bestSeller: {
    type: Boolean,
    default: false,
  },

  newArrival: {
    type: Boolean,
    default: false,
  },

  showOnHomepage: {
    type: Boolean,
    default: false,
  },

  active: {
    type: Boolean,
    default: true,
  },

  deliveryAvailable: {
    type: Boolean,
    default: true,
  },

  deliveryCharge: {
    type: Number,
    default: 0,
  },

  freeDeliveryAbove: {
    type: Number,
    default: 1000,
  },

  estimatedDeliveryTime: {
    type: String,
    default: "3-5 Business Days",
  },

  deliveryRadiusKm: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },

  reviewCount: {
    type: Number,
    default: 0,
  },

  hasVariants: { type: Boolean, default: false },
  variants: [
    {
      color: { type: String, default: "" },
      size: { type: String, default: "" },
      mrp: { type: Number, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, default: 0 },
      sku: { type: String, default: "" },
      image: { type: String, default: "" },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  salesCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Product", productSchema);
