const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  status: {
    type: String,
    enum: ["Unverified", "Member", "Admin"],
    required: true,
  },
});

// Virtual for User's URL
UserSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);
