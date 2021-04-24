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
      following: user.following,
      followers: user.followers,
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
  const user = await User.findById(req.params.id);
  const me = await User.findById(req.user._id);
  const article = await Article.find({});

  const alreadyFollowed = me.following.find(
    (r) => r.user._id.toString() === req.params.id.toString(),
    console.log(req.params.id),
  );

  const matches = [];
  if (user) {
    if (alreadyFollowed) {
      const author_user = await article.find((article) => {
        if (article.author.user.toString() === user._id.toString()) {
          matches.push(article);
        }
      });

      const data = { user, matches };
      res.json(data);
    } else {
      res.status(400);
      throw new Error("You are not allow to see this user profile");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const testSocket = asyncHandler(async (req, res) => {
  const socket = req.app.get("socketio");
  const test = req.body.test;
  socket.sockets.emit("message", console.log("reza"));
  res.json(test);
});

// @desc Follow the user and when you follow user adds into your following and adds into that user followers
// @route /api/users/follow/:id
// @access Private
const followUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const userOwn = await User.findById(req.user._id);

  const followingRequest = req.body.followingRequest;

  // console.log(req.user._id);
  // console.log(req.params.id);

  if (req.user._id == req.params.id) {
    res.status(400);
    throw new Error("You cant follow your self");
  }

  if (user) {
    const alreadyFollowed = userOwn.following.find(
      (r) => r.user._id.toString() === req.params.id.toString(),
      console.log(req.params.id),
    );
    // if (alreadyFollowed) {
    //   res.status(400);
    //   throw new Error("Already follow this user");
    // }

    if (!alreadyFollowed) {
      if (user.accountStatus === "Public") {
        const follower = {
          user: req.user._id,
          name: req.user.name,
        };
        const following = {
          user: req.params.id,
          name: user.name,
        };
        userOwn.following.push(following);
        user.followers.push(follower);

        await userOwn.save();
        await user.save();
        res.json("followed");
      } else {
        const notif = {
          user: req.user._id,
          name: req.user.name,
          followingRequest: "Pending",
        };

        const alreadyFollowed = user.notifications.find(
          (r) => r.user.toString() === notif.user.toString(),
        );

        const alreadyRequested = user.followers.find(
          (r) => r.user.toString() === notif.user.toString(),
        );

        if (alreadyRequested || alreadyFollowed) {
          res.status(400);
          throw new Error("You already submit your request or followed user");
        } else {
          user.notifications.push(notif);

          await user.save();
          res.json("Added to notifications list ");
        }
        //  else {

        //   const notif = {
        //     user: req.user._id,
        //     name: req.user.name,
        //     followingRequest: "Pending",
        //   };

        //   const alreadyFollowed = user.notifications.find(
        //     (r) => r.user.toString() === notif.user.toString(),
        //   );

        //   const alreadyRequested = user.followers.find(
        //     (r) => r.user.toString() === req.params.id.toString(),
        //   );
        //   if (alreadyRequested) {
        //     res.status(400);
        //     throw new Error("You already request");
        //   } else {
        //     user.notifications.push(notif);
        //     await user.save();
        //     res.json("Added to notifications list second");
        //   }
        // }

        // const follower = {
        //   user: req.user._id,
        //   name: req.user.name,
        //   followingRequest: "Active",
        // };
        // const following = {
        //   user: req.params.id,
        //   name: user.name,
        // };
        // userOwn.following.push(following);
        // user.followers.push(follower);
        // await userOwn.save();
        // await user.save();
        // res.json("followed");
      }
    } else {
      const delUser = await user.followers.find((usr) => {
        return usr.user == userOwn.id;
      });

      console.log("del user ", delUser);

      const delUserOwn = await userOwn.following.find((usr) => {
        return usr.user == req.params.id;
      });
      console.log("del user own", delUserOwn);

      await delUser.remove();
      await delUserOwn.remove();

      await user.save();
      await userOwn.save();

      res.json("unfollow");
    }
  } else {
    res.status(404);
    throw new Error("Not found");
  }
});

// @desc    Get all Follow request
// @route   GET /api/users/follow
// @access  Private

const getAllNotificationsHandler = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id);
  const notifs = me.notifications;

  res.json(notifs);
});

// @desc    Follow request
// @route   POST /api/users/follow
// @access  Private

const acceptNotificationsHandler = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id);
  const user = await User.findById(req.params.id);
  const followRequest = req.body.followRequest;

  const userExist = await me.notifications.find((usr) => {
    return usr.user == req.params.id;
  });

  if (userExist) {
    const follower = {
      user: req.user._id,
      name: req.user.name,
      followingRequest: "Active",
    };
    const following = {
      user: req.params.id,
      name: user.name,
    };

    const alreadyFollowed = me.following.find(
      (r) => r.user._id.toString() === req.params.id.toString(),
    );

    if (!alreadyFollowed) {
      me.following.push(following);
      user.followers.push(follower);
      await me.notifications.remove(userExist);

      await me.save();
      await user.save();

      res.json("followed");
    } else {
      res.status(400);
      throw new Error("Already followed");
    }
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }

  res.json("Notification");
});

const delNotificationsHandler = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id);

  console.log("del notif");

  const userExist = await me.notifications.find((usr) => {
    return usr.user == req.params.id;
  });

  console.log(userExist);

  if (userExist) {
    await me.notifications.remove(userExist);
    await me.save();

    res.json("Notification Removed");
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const userOwn = await User.findById(req.user._id);

  if (user) {
    const alreadyFollowed = userOwn.following.find(
      (r) => r.user._id.toString() === req.params.id.toString(),
    );

    if (alreadyFollowed) {
      const delUser = await user.followers.find((usr) => {
        return usr.user == userOwn.id;
      });

      console.log("del user ", delUser);

      const delUserOwn = await userOwn.following.find((usr) => {
        return usr.user == req.params.id;
      });
      console.log("del user own", delUserOwn);

      await delUser.remove();
      await delUserOwn.remove();

      await user.save();
      await userOwn.save();

      res.json("unfollow");
    } else {
      res.status(400);
      throw new Error("You dont follow this user");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const article = await Article.find({});

  const matches = [];
  if (user) {
    const author_user = await article.find((article) => {
      if (article.author.user.toString() === user._id.toString()) {
        matches.push(article);
      }
    });

    const data = { user, matches };
    res.json(data);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Put user profile
// @route PUT /api/users/profile
// @access Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    image,
    followers,
    following,
    accountStatus,
  } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.image = image || user.image;
    user.followers = followers || user.followers;
    user.following = following || user.following;
    user.accountStatus = accountStatus || user.accountStatus;
  }

  const userUpdated = await user.save();

  res.json(userUpdated);
});

export {
  registerUser,
  loginUser,
  followUser,
  getUserProfile,
  getUserInfo,
  unfollowUser,
  updateUserProfile,
  acceptNotificationsHandler,
  getAllNotificationsHandler,
  delNotificationsHandler,
};
