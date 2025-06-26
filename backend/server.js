const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./Data/Data");
const connectDb = require("./Config/db");
const colors = require("colors");

const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require("./Routes/chatRoutes.js");
const messageRoutes = require("./Routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDb();
const app = express();

app.use(express.json()); //to accept json data

app.get("/", (req, res) => {
  res.send("API is running Sucessfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  5000,
  console.log(`Server started on Port ${PORT}`.yellow.bold)
);

//--Socket.io configuration--//

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  // Connection
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room:" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("delete message", ({ messageId, chatId }) => {
    // Broadcast to everyone in the chat room *except* the sender
    socket.to(chatId).emit("message deleted", { messageId });
  });



  // Disconnection
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
