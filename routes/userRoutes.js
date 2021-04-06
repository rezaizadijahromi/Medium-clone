import express from "express";
import User from "../models/users.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

const router = express.Router();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.send("User already exists");
    res.redirect("/");
  }

  const user = await new User({
    name,
    email,
    password,
  });

  if (user) {
    const newUser = await user.save();
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(user.password, password))) {
    if (user.isAdmin === false) {
      user.isAdmin = true;
      await user.save();
    }
  } else {
    res.send("Invalid user or password");
    res.redirect("/");
  }
});
