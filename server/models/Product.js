const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
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

    stock: {
      type: Number,
      default: 0,
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
      
      sku: {
        type: String,
        default: "",
      },
      
      featured: {
        type: Boolean,
        default: false,
      },
      
      active: {
        type: Boolean,
        default: true,
      },
    averageRating:{
        type:Number,
        default:0
    },
    
    reviewCount:{
        type:Number,
        default:0
    },

    hasVariants: { type: Boolean, default: false },
    variants: [
      {
        color: { type: String, default: "" },
        size: { type: String, default: "" },
        mrp: { type: Number, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        image: { type: String, default: "" },
      }
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
    salesCount: {
        type: Number,
        default: 0,
    },
  }
);

module.exports = mongoose.model("Product", productSchema);