const express = require("express");
const {
  createRequirement,
  getRequirements,
  getRequirementMatches,
  getRequirementMatchesSummary,
} = require("../controllers/requirementController");
const { authenticate, requireRetailer } = require("../middleware/authenticate");

const router = express.Router();

router.use(authenticate, requireRetailer);
router.get("/", getRequirements);
router.get("/matches", getRequirementMatchesSummary);
router.get("/:id/matches", getRequirementMatches);
router.post("/", createRequirement);
router.post("/:id/matches", getRequirementMatches);

module.exports = router;
