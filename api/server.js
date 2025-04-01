const express = require('express');
const mongoose = require('mongoose');
const userRoute = require("./routes/user.route")
const orderRoute = require("./routes/order.route") ;
const converstationRoute = require("./routes/conversation.route.js") ;
const reviewRoute = require("./routes/review.route") ;
const messageRoute = require("./routes/message.route") ;
const gigRoute = require("./routes/gig.route") ;
const authRoute = require("./routes/auth.route") ;
const cookieParser = require("cookie-parser") ;



dotenv = require('dotenv');




const app = express(); 
app.use(express.json());
app.use(cookieParser());
dotenv.config() ;



const connect = async()=>
{
    main().catch(err => console.log(err));
    async function main() {
      await mongoose.connect(process.env.MONGO);
      console.log('Connected to MongoDB ');
    }
}
 

app.use("/api/auth", authRoute);
app.use("/api/users" , userRoute) ;



app.use((err , req , res , next)=>
{
  const errorStatus = err.status || 500 ; 
  const errorMessage = err.message || "something wen wrong" ; 
  return res.status(errorStatus).send(errorMessage) ; 
})



app.listen(3000, () => {
    connect();
    console.log('Server is running on port 3000');
});

