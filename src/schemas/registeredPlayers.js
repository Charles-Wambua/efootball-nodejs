const mongoose = require("mongoose");

const RegisteredSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved"],
    default: "Pending",
  },
});

const RegisteredPlayers = mongoose.model("RegisteredPlayers", RegisteredSchema);

module.exports = RegisteredPlayers;
