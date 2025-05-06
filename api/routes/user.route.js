const express = require("express") ; 
const verifyToken = require("../middleware/jwt") ; 
const { deleteUser, getUser, uploadUserImage } = require("../controllers/user.controller") ;

const router = express.Router() ; 

router.delete("/:id" , verifyToken ,deleteUser)
router.get("/:id" , getUser)
router.put("/upload-image", verifyToken, uploadUserImage);

module.exports = router ;