const express = require("express");
const { authenticate, requireRetailer } = require("../middleware/authenticate");
const {
  checkFavorite,
  getFavorites,
  removeFavorite,
  saveFavorite,
} = require("../controllers/favoriteController");

const router = express.Router();

router.use(authenticate, requireRetailer);
router.get("/", getFavorites);
router.get("/:propertyId", checkFavorite);
router.post("/", saveFavorite);
router.delete("/:propertyId", removeFavorite);

module.exports = router;
