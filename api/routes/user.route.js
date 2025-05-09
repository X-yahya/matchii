const express = require("express") ; 
const verifyToken = require("../middleware/jwt") ; 
const { deleteUser, getUser, uploadUserImage, updateUser } = require("../controllers/user.controller") ;

const router = express.Router() ; 

router.delete("/:id" , verifyToken ,deleteUser)
router.get("/:id" , getUser)
router.put("/upload-image", verifyToken, uploadUserImage);
router.put("/:id", verifyToken, updateUser);

module.exports = router ;