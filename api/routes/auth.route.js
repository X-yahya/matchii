const express = require('express');
const app = express() ; 
const router  = express.Router() ;
const { register ,  login, logout, verifyOtp } = require("../controllers/auth.controller") ;

router.post("/register", register) ; 
router.post("/login" , login) ;
router.post("/logout" , logout) ;
router.post("/verify-otp", verifyOtp);

module.exports = router ;