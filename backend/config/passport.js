import { Strategy } from "passport-google-oauth20";
import User from "../models/usersModel.js";
import asyncHandler from "express-async-handler";

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
        };

        try {
          let user = await User.findOne({ email: email[0].value });

          if (user) {
            done(null, user);
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
