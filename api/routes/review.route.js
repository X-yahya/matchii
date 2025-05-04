const express = require('express');
const verifyToken = require("../middleware/jwt") ; 
const { createReview, getReviews, deleteReview } = require('../controllers/review.controller');
const createError = require('../utils/createError');
const  router = express.Router();


router.post('/',verifyToken , createReview ) ; 

router.get("/:gigId" , getReviews) ; 

router.delete("/:id" , verifyToken , deleteReview) ;


module.exports = router ;