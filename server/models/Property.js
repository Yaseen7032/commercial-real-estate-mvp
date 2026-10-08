const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      required: true,
      enum: ["Retail", "Office", "Industrial", "Warehouse", "Land", "Mixed Use", "Shopping Center", "Other"],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    areaSqFt: {
      type: Number,
      required: true,
    },

    monthlyRent: {
      type: Number,
      required: true,
    },

    parking: {
      type: Boolean,
      default: false,
    },

    footTraffic: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    description: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    representative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", propertySchema);