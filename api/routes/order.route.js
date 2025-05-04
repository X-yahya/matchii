const exprees = require('express');
const router = exprees.Router() ;

const { createOrder, getOrders, deleteOrder } = require('../controllers/order.controller') ;
const verifyToken  = require('../middleware/jwt') ;



router.posrt('/' , verifyToken , createOrder) ;
router.get('/' , verifyToken , getOrders) ;
router.delete('/:id' , verifyToken , deleteOrder) ;
