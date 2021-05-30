import { Strategy } from "passport-google-oauth20";
import User from "../models/usersModel.js";
import asyncHandler from "express-async-handler";
import { generateToken, generateConfirmation } from "../utils/generateToken.js";

const googleAuth = asyncHandler(async (passport) => {
  passport.use(
    new Strategy(
      {
        clientID:
          "1005272224546-roddt620t2agtklv6llukg4ku484a486.apps.googleusercontent.com",
        clientSecret: "oGLVtVo0XluV9mEUZ9RY-jdZ",
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails;

        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: email[0].value,
          token: generateToken(profile._id),
        };

        try {
          let user = await User.findOne({ email: email[0].value });

          if (user) {
            const passUser = {
              idAdmin: false,
              accountStatus: user.accountStatus,
              notifications: user.notifications,
              _id: user._id,
              googleId: user.googleId,
              name: user.name,
              email: user.email,
              followers: user.followers,
              following: user.following,
              token: generateToken(user._id),
            };
            done(null, passUser);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
});

export default googleAuth;
