const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["buyer", "seller", "admin"],
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    phone: {
      type: Number,
    },
    banners: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
