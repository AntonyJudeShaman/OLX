const express = require("express");
const User = require("../models/user");
const Item = require("../models/items");
const Chat = require("../models/chat");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { id, name, username, email, password, userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      id: id,
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
      userType: userType,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/wishlist/:id", async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const user = await User.findOneAndUpdate({ id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.wishlistItems.includes(itemId)) {
      user.wishlistItems.push(itemId);
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    const item = await Item.findOneAndDelete({ userId: req.params.id });
    console.log(user);
    if (!user || !item)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:userId/wishlist/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.wishlistItems = user.wishlistItems.filter(
      (item) => item.toString() !== itemId
    );

    await user.save();

    res.status(200).json({ message: "Item removed from wishlist", user });
  } catch (err) {
    console.error("Error removing item from wishlist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/search/user", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const users = await User.find({
      $or: [
        { id: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { userType: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
