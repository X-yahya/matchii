const User = require("../models/user.model") ;
const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const register = async (req, res , next) => {
    try {
        console.log("Password received:", req.body.password);
        const hash =  await bcrypt.hash(req.body.password, 10); 
        console.log(`password hashe: ${hash}`)
        
        const newUser = new User(
            {
                ...req.body , 
                password: hash ,
                
            }
        );
        await newUser.save();
        res.status(200).send("user created");
    } catch (err) {
        next(err) ; 
    }
};

const login = async(req , res , next) =>{
    try
    {
        const user = await User.findOne({username : req.body.username})

        if(!user) return next(createError(404,"User not found !")) ;
        const isCorrect = await bcrypt.compare(req.body.password , user.password) ;
        if(!isCorrect) return next(createError(404,"wrong password or username !")) ;
        const token = jwt.sign({
            id:user._id , 
            isSeller : user.isSeller,
        } ,process.env.JWT_KEY )
        const {passowrd , ...info} = user ;
        res.cookie("accessTOKEN",token , {httpOnly : true,}).status(200).send(user) ;
    }catch(err)
    {
        next(err) ;
        // console.error("Error during user login:", err); 
        // res.status(500).send("something went wrong") ;
    }
}
const logout = async(req , res) =>{
    res
    .clearCookie("accessTOKEN",  {
        sameSite : "none" , 
        secure : true
    }).status(200).send("User has been logged out.")
}
module.exports = { register , login , logout } ;
    
    