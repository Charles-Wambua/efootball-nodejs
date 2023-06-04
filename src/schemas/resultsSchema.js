const mongoose = require("mongoose");

const ResultsSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false
  },
  player: {
    type: String,
    required: true
  },
  opponent: {
    type: String,
    required: true
  },
  playerScore: {
    type: Number,
    required: true
  },
  opponentScore: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Result", ResultsSchema);
