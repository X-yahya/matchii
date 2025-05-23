const express = require("express");
const verifyToken = require("../middleware/jwt");
const router = express.Router();

const {
    createOrder,
    getOrders,
    updateOrderStatus
} = require("../controllers/order.controller");

router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.put("/:id", verifyToken, updateOrderStatus);

module.exports = router;