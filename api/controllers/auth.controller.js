
const User = require("../models/user.model") ;

const register = async (req, res) => {
    try {
        const newUser = new User({
            name: "test",
            email: "test",
            password: "test",
            country: "test",
        });
        await newUser.save();
        res.status(200).send("user created");
    } catch (err) {
        console.error("Error during user registration:", err); // Log the error
        res.status(500).send("something went wrong");
    }
};

const login = async(req , res) =>{}
const logout = async(req , res) =>{}

module.exports = { register , login , logout } ;
    
    