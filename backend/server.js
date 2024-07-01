const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());

const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/items");
const chatRoutes = require("./routes/chat");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: "*",
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/chats", chatRoutes);

const db =
  "mongodb+srv://antony:antony@cluster0.gf1z8yk.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
