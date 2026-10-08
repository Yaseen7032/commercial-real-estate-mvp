const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    representative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    requirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

contactRequestSchema.index({ retailer: 1, property: 1 }, { unique: true });

module.exports = mongoose.model("ContactRequest", contactRequestSchema);
