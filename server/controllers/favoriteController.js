const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");
const Property = require("../models/Property");

async function getFavorites(req, res, next) {
  try {
    const favorites = await Favorite.find({ retailer: req.user.id })
      .populate("property")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, favorites });
  } catch (error) {
    return next(error);
  }
}

async function checkFavorite(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.propertyId)) {
    return res.status(400).json({ success: false, message: "Invalid property ID." });
  }
  try {
    const favorite = await Favorite.findOne({
      retailer: req.user.id,
      property: req.params.propertyId,
    }).select("_id");
    return res.json({ success: true, saved: Boolean(favorite) });
  } catch (error) {
    return next(error);
  }
}

async function saveFavorite(req, res, next) {
  const { propertyId } = req.body || {};
  if (!mongoose.isValidObjectId(propertyId)) {
    return res.status(400).json({ success: false, message: "A valid property is required." });
  }
  try {
    const property = await Property.findById(propertyId).select("_id");
    if (!property) return res.status(404).json({ success: false, message: "Property not found." });
    const favorite = await Favorite.findOneAndUpdate(
      { retailer: req.user.id, property: propertyId },
      { $setOnInsert: { retailer: req.user.id, property: propertyId } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json({ success: true, favorite, saved: true });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: true, saved: true });
    }
    return next(error);
  }
}

async function removeFavorite(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.propertyId)) {
    return res.status(400).json({ success: false, message: "Invalid property ID." });
  }
  try {
    await Favorite.deleteOne({ retailer: req.user.id, property: req.params.propertyId });
    return res.json({ success: true, saved: false });
  } catch (error) {
    return next(error);
  }
}

module.exports = { checkFavorite, getFavorites, removeFavorite, saveFavorite };
