const mongoose = require("mongoose");
const Property = require("../models/Property");
const Requirement = require("../models/Requirement");

const propertyTypes = new Set(["Retail", "Office", "Industrial", "Warehouse", "Land", "Mixed Use", "Other"]);
const footTrafficLevels = new Set(["Low", "Medium", "High"]);

function parseRangeValue(value, fieldName) {
  const parsed = typeof value === "number"
    ? value
    : typeof value === "string" && value.trim()
      ? Number(value)
      : Number.NaN;
  if (!Number.isFinite(parsed) || parsed < 0) {
    return { error: `${fieldName} must be a valid non-negative number.` };
  }
  return { value: parsed };
}

function validateRequirement(body) {
  const requiredText = ["businessName", "preferredLocation", "propertyType"];
  for (const field of requiredText) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return `${field} is required.`;
    }
  }
  if (!propertyTypes.has(body.propertyType)) {
    return "Choose a valid property type.";
  }
  if (typeof body.parkingRequired !== "boolean") {
    return "parkingRequired must be true or false.";
  }
  if (!footTrafficLevels.has(body.preferredFootTraffic)) {
    return "Choose a valid preferred foot traffic level.";
  }

  const values = {};
  for (const field of ["minAreaSqFt", "maxAreaSqFt", "minBudget", "maxBudget"]) {
    const parsed = parseRangeValue(body[field], field);
    if (parsed.error) return parsed.error;
    values[field] = parsed.value;
  }
  if (values.minAreaSqFt > values.maxAreaSqFt) {
    return "Minimum area cannot be greater than maximum area.";
  }
  if (values.minBudget > values.maxBudget) {
    return "Minimum budget cannot be greater than maximum budget.";
  }
  return null;
}

function normalizePropertyType(value) {
  const normalized = value.trim().toLowerCase();
  return normalized === "industrial" || normalized === "warehouse" ? "industrial" : normalized;
}

function scoreRange(value, minimum, maximum) {
  if (value >= minimum && value <= maximum) return 1;
  const distance = value < minimum ? minimum - value : value - maximum;
  return Math.max(0, 1 - distance / Math.max(maximum - minimum, 1));
}

function scoreProperty(requirement, property) {
  let score = 0;
  const reasons = [];
  const locationTerms = requirement.preferredLocation
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
  const propertyLocation = `${property.city} ${property.location}`.toLowerCase();
  const matchedLocations = locationTerms.filter((term) => propertyLocation.includes(term));
  const locationScore = locationTerms.length ? matchedLocations.length / locationTerms.length : 0;
  score += 30 * locationScore;
  if (matchedLocations.length) reasons.push(`Location matches ${matchedLocations.join(", ")}.`);

  const budgetScore = scoreRange(property.monthlyRent, requirement.minBudget, requirement.maxBudget);
  score += 25 * budgetScore;
  if (budgetScore === 1) reasons.push("Monthly rent is within your budget.");
  else if (budgetScore > 0) reasons.push("Monthly rent is close to your budget.");

  const areaScore = scoreRange(property.areaSqFt, requirement.minAreaSqFt, requirement.maxAreaSqFt);
  score += 20 * areaScore;
  if (areaScore === 1) reasons.push("Property size is within your preferred range.");
  else if (areaScore > 0) reasons.push("Property size is close to your preferred range.");

  if (normalizePropertyType(property.propertyType) === normalizePropertyType(requirement.propertyType)) {
    score += 10;
    reasons.push("Property type matches your requirement.");
  }
  if (property.footTraffic === requirement.preferredFootTraffic) {
    score += 10;
    reasons.push(`${property.footTraffic} foot traffic matches your preference.`);
  }
  if (!requirement.parkingRequired || property.parking) {
    score += 5;
    if (requirement.parkingRequired) reasons.push("Parking is available.");
  }

  return { matchScore: Math.round(score), matchingReasons: reasons };
}

async function createRequirement(req, res, next) {
  const body = req.body || {};
  const validationError = validateRequirement(body);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  try {
    const requirement = await Requirement.create({
      retailer: req.user.id,
      businessName: body.businessName.trim(),
      businessType: typeof body.businessType === "string" ? body.businessType.trim() : "",
      preferredLocation: body.preferredLocation.trim(),
      nearbyLandmark: typeof body.nearbyLandmark === "string" ? body.nearbyLandmark.trim() : "",
      propertyType: body.propertyType,
      minAreaSqFt: Number(body.minAreaSqFt),
      maxAreaSqFt: Number(body.maxAreaSqFt),
      minBudget: Number(body.minBudget),
      maxBudget: Number(body.maxBudget),
      parkingRequired: body.parkingRequired,
      preferredFootTraffic: body.preferredFootTraffic,
      additionalPreferences: typeof body.additionalPreferences === "string" ? body.additionalPreferences.trim() : "",
    });
    return res.status(201).json({ success: true, requirement });
  } catch (error) {
    return next(error);
  }
}

async function getRequirements(req, res, next) {
  try {
    const requirements = await Requirement.find({ retailer: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, requirements });
  } catch (error) {
    return next(error);
  }
}

async function getRequirementMatches(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid requirement ID." });
  }

  try {
    const requirement = await Requirement.findOne({
      _id: req.params.id,
      retailer: req.user.id,
    }).lean();
    if (!requirement) {
      return res.status(404).json({ success: false, message: "Requirement not found." });
    }

    const properties = await Property.find({}).lean();
    const matches = properties
      .map((property) => ({ property, ...scoreProperty(requirement, property) }))
      .filter((match) => match.matchScore > 0)
      .sort((left, right) => right.matchScore - left.matchScore);

    return res.json({
      success: true,
      requirement,
      matches,
      message: matches.length ? undefined : "No matching properties found for your current requirement.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createRequirement, getRequirementMatches, getRequirements };
