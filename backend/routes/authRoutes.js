import express from "express";
import passport from "passport";

import { protect, admin } from "../middlewares/authMiddleWare.js";
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  function (req, res) {},
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  function (req, res) {
    var token = req.user.token;
    res.redirect("http://localhost:3000?token=" + token);
  },
);

export default router;
