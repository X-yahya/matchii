const express = require('express');
const mongoose = require('mongoose');
const userRoute = require("./routes/user.route")
const orderRoute = require("./routes/order.route") ;
const converstationRoute = require("./routes/conversation.route.js") ;
const reviewRoute = require("./routes/review.route") ;
const messageRoute = require("./routes/message.route") ;
const gigRoute = require("./routes/gig.route") ;
const authRoute = require("./routes/auth.route") ;




dotenv = require('dotenv');




const app = express(); 
app.use(express.json());
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




app.listen(3000, () => {
    connect();
    console.log('Server is running on port 3000');
});

