import mongoose from "mongoose";
import bcrypt from "bcryptjs";

let UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  provider: String,
  provider_id: String,
  token: String,
  provider_pic: String,
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

UserSchema.methods.follow = async function (user_id) {
  if (this.following.indexOf(user_id) === -1) {
    this.following.push(user_id);
  }
  return await this.save();
};

UserSchema.methods.addFollower = async function (fs) {
  this.followers.push(fs);
};

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", UserSchema);
export default User;
