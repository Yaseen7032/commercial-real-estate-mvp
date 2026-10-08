const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
  {
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      trim: true,
    },

    preferredLocation: {
      type: String,
      required: true,
      trim: true,
    },

    nearbyLandmark: {
      type: String,
      trim: true,
    },

    propertyType: {
      type: String,
      required: true,
      enum: ["Retail", "Office", "Industrial", "Warehouse", "Land", "Mixed Use", "Shopping Center", "Other"],
    },

    minAreaSqFt: {
      type: Number,
    },

    maxAreaSqFt: {
      type: Number,
    },

    minBudget: {
      type: Number,
    },

    maxBudget: {
      type: Number,
    },

    parkingRequired: {
      type: Boolean,
      default: false,
    },

    preferredFootTraffic: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    additionalPreferences: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Requirement", requirementSchema);