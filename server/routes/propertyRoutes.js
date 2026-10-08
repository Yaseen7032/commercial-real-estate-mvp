const express = require("express");
const { createProperty, getMyProperties, getProperties, getProperty } = require("../controllers/propertyController");
const { authenticate, requireRepresentative } = require("../middleware/authenticate");

const router = express.Router();

router.get("/", getProperties);
router.get("/mine", authenticate, requireRepresentative, getMyProperties);
router.get("/:id", getProperty);
router.post("/", authenticate, requireRepresentative, createProperty);

module.exports = router;
