const express = require("express");
const verifyToken = require("../middleware/jwt");
const router = express.Router();

const {
    createOrder,
    getOrders,
    updateOrderStatus , checkOrder , getOrdersByGig
} = require("../controllers/order.controller");

router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/gig-orders", verifyToken, getOrdersByGig);

router.put("/:id", verifyToken, updateOrderStatus);

// Add to order.routes.js
router.get("/check/:gigId", verifyToken, checkOrder);
module.exports = router;