const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chat");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/items");
const chatRoutes = require("./routes/chat");

app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/chats", chatRoutes);

const db =
  "mongodb+srv://antony:antony@cluster0.gf1z8yk.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinChat", ({ itemId, buyerId, sellerId }) => {
    const room = `${itemId}-${buyerId}-${sellerId}`;
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on(
    "sendMessage",
    async ({ itemId, buyerId, sellerId, senderId, message }) => {
      const room = `${itemId}-${buyerId}-${sellerId}`;
      console.log(`Message received: ${message}`);

      let chat = await Chat.findOne({
        itemId,
        buyerId,
        sellerId,
      });
      if (!chat) {
        chat = new Chat({
          itemId,
          buyerId,
          sellerId,
          messages: [],
        });
      }
      chat.messages.push({
        senderId,
        message,
      });
      await chat.save();

      console.log(`Message saved: ${message}`);

      io.to(room).emit("receiveMessage", chat.messages);
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
