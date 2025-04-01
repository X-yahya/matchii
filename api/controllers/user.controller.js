const createError = require("../utils/createError");

User = require("../models/user.model") ; 
jwt = require("jsonwebtoken") ; 


const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    const token = req.cookies.accessTOKEN;
    if (!token) {
        return createError(403,"You are not authenticated");
    }
        if (req.userId !== user._id.toString()) {
            return createError(403 ,"you can only delete your account");
        }

        await User.findByIdAndDelete(req.params.id);
        return res.status(200).send("User deleted successfully.");
};


module.exports = deleteUser ; 