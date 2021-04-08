import asyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import User from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import { generateToken, generateConfirmation } from "../utils/generateToken.js";

// @desc Register a new user
// @route POST /api/users
// @access Public

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

// @desc Login in get token
// @route POST /api/users/login
// @access Public

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

// @desc Get users id for going into their profile
// @route /api/users/profile/:id
// @access Public
const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "user",
    "followers following",
  );
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Follow the user and when you follow user adds into your following and adds into that user followers
// @route /api/users/follow/:id
// @access Private
const followUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const userOwn = await User.findById(req.user._id);

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
      user: req.user._id,
    };
    const following = {
      user: req.params.id,
    };
    userOwn.following.push(following);
    user.followers.push(follower);

    await userOwn.save();
    await user.save();
    res.json("done");
  } else {
    res.status(404);
    throw new Error("Not found");
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "user",
    "following followers",
  );
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { registerUser, loginUser, followUser, getUserProfile, getUserInfo };
