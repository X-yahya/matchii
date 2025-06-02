const express = require('express');
const mongoose = require('mongoose');
const {createServer} = require("http");
const {Server} = require("socket.io");
dotenv = require('dotenv');
const cors = require('cors');
const userRoute = require("./routes/user.route")
const gigRoute = require("./routes/gig.route.js")
const reviewRoute = require("./routes/review.route.js")
const authRoute = require("./routes/auth.route.js")
const orderRoute = require("./routes/order.route.js")
const conversationRoute = require("./routes/conversation.route.js")
const messageRoute = require("./routes/message.route.js") ; 
const projectRoute = require("./routes/project.route.js")
proposalRoute = require("./routes/proposal.route.js") ;

const cookieParser = require("cookie-parser") ;



const app = express(); 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true, 
}));

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
app.use(express.json());
app.use(cookieParser());
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('join-conversations', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Attach socket instance to app
app.set('socketio', io);

// Use httpServer instead of app for listening
httpServer.listen(9000, () => {
  console.log("Backend server is running!");
});

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
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute)
app.use("/api/reviews", reviewRoute);
app.use("/api/orders" , orderRoute) ; 
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/projects", projectRoute) ;
app.use("/api/proposals" , proposalRoute) ;


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

