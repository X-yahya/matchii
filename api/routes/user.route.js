const express = require("express") ; 
const verifyToken = require("../middleware/jwt") ; 
const deleteUser = require("../controllers/user.controller") ; 
const router = express.Router() ; 

router.delete("/:id" , verifyToken ,deleteUser)


module.exports = router ;