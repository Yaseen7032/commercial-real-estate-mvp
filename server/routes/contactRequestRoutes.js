const express = require("express");
const { authenticate, requireRepresentative, requireRetailer } = require("../middleware/authenticate");
const {
  createContactRequest,
  getContactRequests,
  getReceivedContactRequests,
} = require("../controllers/contactRequestController");

const router = express.Router();

router.get("/", authenticate, requireRetailer, getContactRequests);
router.get("/received", authenticate, requireRepresentative, getReceivedContactRequests);
router.post("/", authenticate, requireRetailer, createContactRequest);

module.exports = router;
