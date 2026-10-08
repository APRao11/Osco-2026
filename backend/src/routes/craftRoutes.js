const express = require("express");
const { getAllCrafts, getCraftById } = require("../controllers/craftController");

const router = express.Router();

router.get("/", getAllCrafts);
router.get("/:id", getCraftById);

module.exports = router;
