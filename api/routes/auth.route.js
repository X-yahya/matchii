const express = require('express');
const router  = express.Router() ;
const { register ,  login, logout, verifyOtp , forgotPassword , verifyResetOtp , resetPassword  } = require("../controllers/auth.controller") ;

router.post("/register", register) ; 
router.post("/login" , login) ;
router.post("/logout" , logout) ;
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router ;