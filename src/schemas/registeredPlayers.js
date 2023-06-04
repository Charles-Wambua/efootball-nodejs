const mongoose = require("mongoose");

const RegisteredSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phoneNumber: Number,
  
});

const RegisterPlayers = mongoose.model("RegisteredPlayers", RegisteredSchema);

module.exports = RegisterPlayers;
