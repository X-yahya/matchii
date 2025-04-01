const createError = require("../utils/createError");

const verifyToken =  (req, res , next) =>
{
    const token = req.cookies.accessTOKEN;
    if (!token) {

        return next(createError(401 ,"You are not authenticated"));
        // return res.status(401).send("You are not authenticated!");
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if(err) return next(createError(403 ,"Token is not valid !")) ; 
        req.userId = payload.id ; 
        req.isSeller = payload.isSeller ; 
       next() ; 
    });
   
}
module.exports = verifyToken ;