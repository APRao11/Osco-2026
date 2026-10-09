const express = require("express");
const { createCustomOrderRequest, createArtisanSupport } = require("../controllers/communityController");

const router = express.Router();

router.post("/custom-orders", createCustomOrderRequest);
router.post("/support", createArtisanSupport);

module.exports = router;