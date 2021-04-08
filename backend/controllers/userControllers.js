import asyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import User from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import { generateToken, generateConfirmation } from "../utils/generateToken.js";

//add user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const alreadyExists = await User.findOne({ email });

  if (alreadyExists) {
    res.status(400);
    throw new Error("Already register with this email");
  }

  const user = new User({
    name,
    email,
    password,
  });

  if (user) {
    const newUser = await user.save();
    res.status(201).json({
      name,
      email,
      password,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Bad data");
  }
});
//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//get user
const getUser = asyncHandler(async (req, res) => {
  const user = awaitUser.findById(req.user._id);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//follow user
const followUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // const userr = await User.findById(req.user._id);

  // console.log(req.user._id);
  // console.log(req.params.id);

  if (req.user._id == req.params.id) {
    res.status(400);
    throw new Error("You cant follow your self");
  }

  if (user) {
    const alreadyFollowed = user.followers.find(
      (r) => r.user.toString() === req.params.id.toString(),
    );
    if (alreadyFollowed) {
      res.status(400);
      throw new Error("Already follow this user");
    }
    const follower = {
      user: req.params.id,
    };
    user.followers.push(follower);
    await user.save();
    res.json("done");
  } else {
    res.status(404);
    throw new Error("Not found");
  }
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "following followers",
  );
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { registerUser, loginUser, followUser, getUserProfile, getUser };
