const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const jwtSecret = require("../config/jwt");

async function authenticate(req, res, next) {
  const authorization = req.get("Authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) {
    return res.status(401).json({ success: false, message: "Please sign in to continue." });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    if (typeof payload.sub !== "string" || !mongoose.isValidObjectId(payload.sub)) {
      return res.status(401).json({ success: false, message: "Your session is invalid. Please sign in again." });
    }

    const user = await User.findById(payload.sub).select("_id role");
    if (!user) {
      return res.status(401).json({ success: false, message: "Your account could not be found. Please sign in again." });
    }

    req.user = { id: user._id, role: user.role };
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Your session has expired. Please sign in again." });
    }
    return next(error);
  }
}

function requireRetailer(req, res, next) {
  if (req.user?.role !== "retailer") {
    return res.status(403).json({ success: false, message: "Only retailer accounts can perform this action." });
  }
  return next();
}

function requireRepresentative(req, res, next) {
  if (req.user?.role !== "tenantRepresentative") {
    return res.status(403).json({ success: false, message: "Only tenant representatives can manage listings and requests." });
  }
  return next();
}

module.exports = { authenticate, requireRepresentative, requireRetailer };
