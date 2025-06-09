const express = require("express") ; 
const router = express.Router();

const verifyToken = require("../middleware/jwt") ;
const { createGig, deleteGig, getGig, getGigs, getMyGigs ,updateGig , toggleGigStatus ,enhanceGig  } = require("../controllers/gig.controller") ;


// router.post("/:id/enhance", verifyToken, enhanceGig);
router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);
router.get("/mygigs", verifyToken, getMyGigs);
router.put("/:id" , verifyToken , updateGig) ; 
router.patch("/:id/toggle-status", verifyToken, toggleGigStatus);
router.put("/enhance/:id", verifyToken, enhanceGig); // Add this route for gig enhancement

module.exports =  router;