const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose"); 
const cors = require("cors");
const resultsRoute = require("./src/routes/results");
const { Chat } = require('./src/schemas/chatSchema');
const addProfileRoute=require('./src/routes/userProfile')
const getProfileRoute=require('./src/routes/getUserProfile')
const getprofiles=require('./src/routes/getplayers')
const getResults=require('./src/routes/getResults')
const payViaMpesa = require('./src/routes/mpesaPayments')
const loginRoute= require("./src/routes/loginRoute")
const registerplayers = require("./src/routes/registerLeague")
const getregisteredplayers = require("./src/routes/registerLeague")

const fixtures=require("./src/routes/postFixtures")

const app = express();
app.use(express.urlencoded({ extended: true }))
// app.use(cors())
app.use(cors({ origin: ["https://efootball.onrender.com"],}));
app.use(express.json());
app.use("/results", resultsRoute);
app.use("/addProfile",addProfileRoute)
app.use("/profile/:id",getProfileRoute)
app.use("/profiles", getprofiles)
app.use("/get-results", getResults)
app.use("/mpesa/payments", payViaMpesa)
app.use("/login", loginRoute)
app.use("/register-league", registerplayers)
app.use("/get-registeredPlayers", getregisteredplayers)
app.use("/fixtures", fixtures)

// app.use("/stk", stk)

mongoose
  .connect("mongodb+srv://charles:charlie98@cluster0.xb6sco7.mongodb.net/Efootball?retryWrites=true&w=majority")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection failed: " + error);
  });

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://efootball.onrender.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data)
    console.log(`User with id ${socket.id} joined room ${data}`)
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data)

  
  })

  socket.on("disconnect", (socketIO) => {
    console.log(`A user disconnected ${socket.id}`);
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
console.log("Cloudinary connected successfully");
