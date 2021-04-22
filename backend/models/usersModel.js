import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const FollowingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const FollowersSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
    },
    followingRequest: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

let UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  image: String,
  idAdmin: {
    type: Boolean,
    default: false,
  },
  accountStatus: {
    type: String,
    enum: ["Private", "Public"],
    default: "Private",
  },

  followers: [FollowersSchema],
  following: [FollowingSchema],
});
UserSchema.methods.follow = function (id) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id);
  }

  return this.save();
};

UserSchema.methods.unfollow = function (id) {
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function (id) {
  return this.following.some(function (followId) {
    return followId.toString() === id.toString();
  });
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);
export default User;

// {
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
// },
