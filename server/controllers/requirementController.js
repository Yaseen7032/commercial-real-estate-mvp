const mongoose = require("mongoose");
const Property = require("../models/Property");
const Requirement = require("../models/Requirement");

const propertyTypes = new Set(Property.schema.path("propertyType").enumValues);
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
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function compareRange(value, minimum, maximum) {
  const propertyValue = value === null || value === undefined || value === ""
    ? Number.NaN
    : Number(value);
  const min = minimum === null || minimum === undefined || minimum === ""
    ? Number.NaN
    : Number(minimum);
  const max = maximum === null || maximum === undefined || maximum === ""
    ? Number.NaN
    : Number(maximum);

  if (!Number.isFinite(propertyValue) || (!Number.isFinite(min) && !Number.isFinite(max))) {
    return null;
  }
  return (!Number.isFinite(min) || propertyValue >= min)
    && (!Number.isFinite(max) || propertyValue <= max);
}

function prepareRequirementForMatching(requirement) {
  return {
    ...requirement,
    locationTerms: (requirement.preferredLocation || "")
      .split(",")
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean),
    normalizedPropertyType: typeof requirement.propertyType === "string"
      ? normalizePropertyType(requirement.propertyType)
      : "",
  };
}

function preparePropertiesForMatching(properties) {
  return properties.map((property) => {
    const propertyLocation = [property.city, property.location]
      .filter((value) => typeof value === "string" && value.trim())
      .join(" ")
      .toLowerCase();
    return {
      property,
      propertyLocation,
      normalizedPropertyType: typeof property.propertyType === "string"
        ? normalizePropertyType(property.propertyType)
        : "",
    };
  });
}

function scoreProperty(requirement, preparedProperty, includeReasons = true) {
  const { property, propertyLocation, normalizedPropertyType } = preparedProperty;
  const matchedLocations = requirement.locationTerms.filter((term) => propertyLocation.includes(term));
  const hasLocationData = Boolean(propertyLocation && requirement.locationTerms.length);
  const hasPropertyType = Boolean(normalizedPropertyType && requirement.normalizedPropertyType);
  const budgetComparison = compareRange(
    property.monthlyRent,
    requirement.minBudget,
    requirement.maxBudget
  );
  const areaComparison = compareRange(
    property.areaSqFt,
    requirement.minAreaSqFt,
    requirement.maxAreaSqFt
  );

  if (
    (hasLocationData && matchedLocations.length === 0)
    || (hasPropertyType && normalizedPropertyType !== requirement.normalizedPropertyType)
    || budgetComparison === false
    || areaComparison === false
  ) {
    return null;
  }

  let score = 0;
  let maximumScore = 0;
  const reasons = includeReasons ? [] : null;
  if (hasLocationData) {
    maximumScore += 30;
    score += 30 * (matchedLocations.length / requirement.locationTerms.length);
    if (reasons) reasons.push(`Location matches ${matchedLocations.join(", ")}.`);
  }

  if (budgetComparison !== null) {
    maximumScore += 25;
    score += 25;
    if (reasons) reasons.push("Monthly rent is within your budget.");
  }

  if (areaComparison !== null) {
    maximumScore += 20;
    score += 20;
    if (reasons) reasons.push("Property size is within your preferred range.");
  }

  if (hasPropertyType) {
    maximumScore += 10;
    score += 10;
    if (reasons) reasons.push("Property type matches your requirement.");
  }
  if (["Low", "Medium", "High"].includes(property.footTraffic)) {
    maximumScore += 10;
    if (property.footTraffic === requirement.preferredFootTraffic) {
      score += 10;
      if (reasons) reasons.push(`${property.footTraffic} foot traffic matches your preference.`);
    } else if (reasons) {
      reasons.push("Foot traffic does not match your preference.");
    }
  }
  if (typeof property.parking === "boolean") {
    maximumScore += 5;
    if (!requirement.parkingRequired || property.parking) {
      score += 5;
      if (reasons && requirement.parkingRequired) reasons.push("Parking is available.");
    } else if (reasons) {
      reasons.push("Parking is not available.");
    }
  }

  const match = { matchScore: maximumScore ? Math.round((score / maximumScore) * 100) : 0 };
  if (reasons) match.matchingReasons = reasons;
  return match;
}

function findRequirementMatches(requirement, preparedProperties) {
  const preparedRequirement = prepareRequirementForMatching(requirement);
  return preparedProperties
    .map((preparedProperty) => {
      const match = scoreProperty(preparedRequirement, preparedProperty);
      return match ? { property: preparedProperty.property, ...match } : null;
    })
    .filter(Boolean)
    .sort((left, right) => right.matchScore - left.matchScore);
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
    const matches = findRequirementMatches(
      requirement,
      preparePropertiesForMatching(properties)
    );

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

async function getRequirementMatchesSummary(req, res, next) {
  const selectedRequirementId = req.query.selectedRequirementId;
  if (selectedRequirementId && !mongoose.isValidObjectId(selectedRequirementId)) {
    return res.status(400).json({ success: false, message: "Invalid requirement ID." });
  }

  try {
    const requirements = await Requirement.find({ retailer: req.user.id })
      .select("_id businessName preferredLocation propertyType minBudget maxBudget minAreaSqFt maxAreaSqFt parkingRequired preferredFootTraffic status createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const selectedRequirement = selectedRequirementId
      ? requirements.find((requirement) => String(requirement._id) === selectedRequirementId)
      : requirements[0];
    if (selectedRequirementId && !selectedRequirement) {
      return res.status(404).json({ success: false, message: "Requirement not found." });
    }
    if (!selectedRequirement) {
      return res.json({
        success: true,
        requirements,
        matches: [],
        matchCount: 0,
      });
    }

    const properties = await Property.find({})
      .select("_id title propertyType location city monthlyRent areaSqFt parking footTraffic description")
      .lean();
    const preparedProperties = preparePropertiesForMatching(properties);
    const matchedPropertyIndexes = new Uint8Array(preparedProperties.length);
    let selectedMatches = [];

    for (const requirement of requirements) {
      const preparedRequirement = prepareRequirementForMatching(requirement);
      const isSelectedRequirement = requirement === selectedRequirement;
      for (let index = 0; index < preparedProperties.length; index += 1) {
        const preparedProperty = preparedProperties[index];
        const match = scoreProperty(
          preparedRequirement,
          preparedProperty,
          isSelectedRequirement
        );
        if (!match || match.matchScore === 0) continue;

        matchedPropertyIndexes[index] = 1;
        if (isSelectedRequirement) {
          selectedMatches.push({ property: preparedProperty.property, ...match });
        }
      }
    }
    selectedMatches.sort((left, right) => right.matchScore - left.matchScore);
    let matchCount = 0;
    for (const isMatched of matchedPropertyIndexes) matchCount += isMatched;

    return res.json({
      success: true,
      requirements,
      matches: selectedMatches,
      matchCount,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createRequirement,
  getRequirementMatches,
  getRequirementMatchesSummary,
  getRequirements,
};
