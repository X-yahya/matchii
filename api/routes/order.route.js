const express = require("express") ; 
const verifyToken = require("../middleware/jwt") ;
const Order = require("../models/oder.model") ;
const router = express.Router();


const {createOrder , getOrders} = require("../controllers/order.controller") ; 

router.post("/:gigId" , verifyToken , createOrder) ;
router.get("/" , verifyToken , getOrders) ;


module.exports = router ;



