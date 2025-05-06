const express = require('express');
const mongoose = require('mongoose');
dotenv = require('dotenv');
const cors = require('cors');
const userRoute = require("./routes/user.route")
const gigRoute = require("./routes/gig.route.js") ; 
const reviewRoute = require("./routes/review.route.js") ;
const authRoute = require("./routes/auth.route") ;
const orderRoute = require("./routes/order.route") ;
const converstationRoute = require("./routes/conversation.route.js") ;
const messageRoute = require("./routes/message.route") ;
const cookieParser = require("cookie-parser") ;







const app = express(); 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true, 
}));
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

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
 

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute)
app.use("/api/reviews", reviewRoute);



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

