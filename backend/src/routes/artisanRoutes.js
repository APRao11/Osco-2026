const express = require("express");
const { login, getArtisanProfile, updateArtisanProfile, getArtisanProducts, getArtisanOrders } = require("../controllers/artisanController");

const router = express.Router();

router.post("/login", login);
router.get("/:artisanId/profile", getArtisanProfile);
router.patch("/:artisanId/profile", updateArtisanProfile);
router.get("/:artisanId/products", getArtisanProducts);
router.get("/:artisanId/orders", getArtisanOrders);

module.exports = router;
