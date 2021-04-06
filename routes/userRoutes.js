import express from "express";
import User from "../models/users.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import passport from "passport";
import flash from "express-flash";
import session from "express-session";

import {
  checkAuthenticated,
  checkNotAuthenticated,
} from "../middlewares/AuthenticatedMiddleWare.js";

import initializePassport from "../config/initialize.js";

const router = express.Router();

// initializer //

initializePassport(
  passport,
  (email) => User.find((user) => user.email === email),
  (id) => User.find((user) => user.id === id),
);

console.log(initializePassport);

// Routes //

router.get("/", checkAuthenticated, (req, res) => {
  res.render("authentication/index.ejs", { name: req.user.name });
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("authentication/login.ejs");
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
);

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    console.log(user);
    if (user) {
      const newUser = await newUser.save();
      console.log(user);
    } else {
      console.log(user);
    }

    res.redirect("/login");
  } catch (error) {
    res.redirect("/register");
  }
});

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("authentication/register.ejs");
});

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

export default router;
