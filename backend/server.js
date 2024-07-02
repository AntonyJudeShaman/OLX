const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/items");
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
  }
});

app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: "*",
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use('/api/chat', chatRoutes);

const db = "mongodb+srv://hariraja24cs:ABCdef123*@cluster0.5ftive4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    console.log('Message received from client:', message);
    const chatMessage = new ChatMessage(message);
    chatMessage.save((err) => {
      if (err) {
        console.error('Error saving message to MongoDB:', err);
        return;
      }
      io.emit('receiveMessage', message);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
