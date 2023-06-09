const express = require("express");
const router = express.Router();
const Fixture = require("../schemas/postFixturesSchema"); // Assuming you have a Fixture model

router.post("/postFixtures", async (req, res) => {
  try {
    const fixturesData = req.body;

    // Assuming you have a Fixture model with appropriate schema
    const fixtures = await Fixture.create(fixturesData);

    res.status(201).json({ success: true, fixtures });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to store fixtures in the database.",
    });
  }
});
router.post("/postResults/:id", async (req, res) => {
  try {
    const { playerScore, opponentScore } = req.body;
    const matchId = req.params.id;
    console.log(matchId)
    console.log(req.body)

    // Retrieve the fixture and update the match with the given ID
    const fixture = await Fixture.findOne({ "matches._id": matchId });
    // console.log(fixture)
    
    if (!fixture) {
      return res.status(404).json({
        success: false,
        error: "Fixture not found.",
      });
    }

    const match = fixture.matches.id(matchId);
    console.log(match)
    
    if (!match) {
      return res.status(404).json({
        success: false,
        error: "Match not found.",
      });
    }

    match.homeScore = playerScore;
    match.awayScore = opponentScore;

    await fixture.save();
    console.log(fixture)

    res.status(200).json({ success: true, fixture });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to update fixture with results in the database.",
    });
  }
});

router.get("/getFixtures", async (req, res) => {
  try {
    // Assuming you have a Fixture model with appropriate schema
    const fixtures = await Fixture.find();
    res.status(200).json({ success: true, fixtures });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch fixtures from the database.",
    });
  }
});


module.exports = router;
