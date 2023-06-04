const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: false,
  },
  matches: [
    {
      homePlayer: {
        type: String,
        required: true,
      },
      awayPlayer: {
        type: String,
        required: true,
      },
    },
  ],
});

const Fixture = mongoose.model('Fixture', fixtureSchema);

module.exports = Fixture;
