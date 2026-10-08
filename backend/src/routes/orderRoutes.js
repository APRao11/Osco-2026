const express = require("express");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);
router.patch("/:id", updateOrderStatus);

module.exports = router;
