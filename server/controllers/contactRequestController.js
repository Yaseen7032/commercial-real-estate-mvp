const mongoose = require("mongoose");
const ContactRequest = require("../models/ContactRequest");
const Property = require("../models/Property");
const Requirement = require("../models/Requirement");
const User = require("../models/User");

async function getContactRequests(req, res, next) {
  try {
    const requests = await ContactRequest.find({ retailer: req.user.id })
      .populate("property", "title propertyType location city areaSqFt monthlyRent imageUrl")
      .populate("representative", "name email role")
      .populate("requirement", "businessName preferredLocation")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, requests });
  } catch (error) {
    return next(error);
  }
}

async function getReceivedContactRequests(req, res, next) {
  try {
    const requests = await ContactRequest.find({ representative: req.user.id })
      .populate("property", "title propertyType location city areaSqFt monthlyRent imageUrl")
      .populate("retailer", "name email role")
      .populate("requirement", "businessName preferredLocation")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, requests });
  } catch (error) {
    return next(error);
  }
}

async function createContactRequest(req, res, next) {
  const { propertyId, requirementId } = req.body || {};
  if (!mongoose.isValidObjectId(propertyId)) {
    return res.status(400).json({ success: false, message: "A valid property is required." });
  }

  try {
    const property = await Property.findById(propertyId).select("representative");
    if (!property) return res.status(404).json({ success: false, message: "Property not found." });
    if (!property.representative) {
      return res.status(400).json({ success: false, message: "This property does not have a representative assigned yet." });
    }

    const representative = await User.findOne({
      _id: property.representative,
      role: "tenantRepresentative",
    }).select("_id");
    if (!representative) {
      return res.status(400).json({ success: false, message: "This property does not have a valid representative assigned." });
    }

    let requirement = null;
    if (requirementId !== undefined && requirementId !== null && requirementId !== "") {
      if (!mongoose.isValidObjectId(requirementId)) {
        return res.status(400).json({ success: false, message: "Invalid requirement ID." });
      }
      requirement = await Requirement.findOne({ _id: requirementId, retailer: req.user.id }).select("_id");
      if (!requirement) {
        return res.status(404).json({ success: false, message: "Requirement not found." });
      }
    }

    const existingRequest = await ContactRequest.findOne({
      retailer: req.user.id,
      property: propertyId,
    });
    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You have already sent a contact request for this property.",
        requestId: existingRequest._id,
      });
    }

    const request = await ContactRequest.create({
      retailer: req.user.id,
      representative: representative._id,
      property: property._id,
      ...(requirement ? { requirement: requirement._id } : {}),
      status: "pending",
    });
    return res.status(201).json({
      success: true,
      message: "Your contact request was sent successfully.",
      request,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already sent a contact request for this property.",
      });
    }
    return next(error);
  }
}

module.exports = { createContactRequest, getContactRequests, getReceivedContactRequests };
