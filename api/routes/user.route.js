const express = require("express") ; 
const verifyToken = require("../middleware/jwt") ; 
const { deleteUser, getUser } = require("../controllers/user.controller") ;

const router = express.Router() ; 

router.delete("/:id" , verifyToken ,deleteUser)
router.get("/:id" , getUser)

module.exports = router ;