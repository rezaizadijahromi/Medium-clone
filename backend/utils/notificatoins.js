import User from "../models/usersModel.js";
import Notification from "../models/notificationModel.js";
import asyncHandler from "express-async-handler";

const newFollowerRequest = asyncHandler(async (userId, username, userOwnId) => {
  try {
    const userOwn = await User.findById(userOwnId);
    const user = await User.findById(userId);

    if (!userOwn) {
      throw new Error(`Cant't find user with id: ${userOwnId}`);
    }

    const alreadyFollowed = await user.notifications.find(
      (r) => r.user.toString() === userId,
    );

    const alreadyRequested = await user.following.find(
      (r) => r.user.toString() === userId,
    );

    if (alreadyFollowed || alreadyRequested) {
      throw new Error("You already submit your request or followed user");
    } else {
      const newNotification = {
        type: "newFollower",
        user: userId,
        text: "New user attep to follow you",
      };

      const notifyBefor = await Notification.findOne({ user: userOwnId });

      if (!notifyBefor) {
        const notification = new Notification();

        notification.user = userOwn;
        await notification.save();
      }

      const userToNotify = await Notification.findOne({ user: userOwnId });

      userToNotify.notifications.push(newNotification);

      await userToNotify.save();

      const success = true;

      return { success, userId, userOwnId, username };
    }
  } catch (error) {
    console.log(error);
  }
});

export { newFollowerRequest };
