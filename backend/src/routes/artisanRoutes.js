const express = require("express");
const { login, getArtisanProducts, getArtisanOrders } = require("../controllers/artisanController");

const router = express.Router();

router.post("/login", login);
router.get("/:artisanId/products", getArtisanProducts);
router.get("/:artisanId/orders", getArtisanOrders);

module.exports = router;
