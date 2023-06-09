const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
