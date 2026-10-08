const mongoose = require("mongoose");
const Property = require("../models/Property");

async function getProperties(req, res, next) {
  try {
    const query = {};
    if (req.query.type && req.query.type !== "All") query.propertyType = req.query.type;
    const properties = await Property.find(query)
      .populate("representative", "name email role")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, properties });
  } catch (error) {
    return next(error);
  }
}

async function getProperty(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Property not found." });
  }
  try {
    const property = await Property.findById(req.params.id)
      .populate("representative", "name email role")
      .lean();
    if (!property) return res.status(404).json({ success: false, message: "Property not found." });
    return res.json({ success: true, property });
  } catch (error) {
    return next(error);
  }
}

async function getMyProperties(req, res, next) {
  try {
    const properties = await Property.find({ representative: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, properties });
  } catch (error) {
    return next(error);
  }
}

async function createProperty(req, res, next) {
  const { title, propertyType, location, city, areaSqFt, monthlyRent, parking, footTraffic, description, imageUrl } = req.body || {};
  if (
    typeof title !== "string" || !title.trim()
    || typeof propertyType !== "string" || !propertyType.trim()
    || !["Retail", "Office", "Industrial", "Warehouse", "Land", "Mixed Use", "Shopping Center", "Other"].includes(propertyType)
    || typeof location !== "string" || !location.trim()
    || typeof city !== "string" || !city.trim()
    || !Number.isFinite(Number(areaSqFt)) || Number(areaSqFt) <= 0
    || !Number.isFinite(Number(monthlyRent)) || Number(monthlyRent) < 0
    || typeof parking !== "boolean"
    || !["Low", "Medium", "High"].includes(footTraffic)
  ) {
    return res.status(400).json({ success: false, message: "Complete all property details with valid values." });
  }

  try {
    const property = await Property.create({
      title: title.trim(),
      propertyType,
      location: location.trim(),
      city: city.trim(),
      areaSqFt: Number(areaSqFt),
      monthlyRent: Number(monthlyRent),
      parking,
      footTraffic,
      description: typeof description === "string" ? description.trim() : "",
      imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",
      representative: req.user.id,
    });
    return res.status(201).json({ success: true, property });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createProperty, getMyProperties, getProperties, getProperty };
