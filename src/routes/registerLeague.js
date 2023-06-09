const express = require("express");
const router = express.Router();
const RegisteredPlayers = require("../schemas/registeredPlayers");

router.post("/register-league", async (req, res) => {
  try {
    const { username, mpesaName, phoneNumber } = req.body;

    // Validate the registration data and perform any necessary checks

    // Store the registration in the database with the "Pending" status
    const registeredPlayer = new RegisteredPlayers({
      username,
      mpesaName,
      phoneNumber,
      approvalStatus: "Pending",
    });
    await registeredPlayer.save();

    res.status(201).json({ message: "Registration Successful😊" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred, try again!😪" });
  }
});

router.post("/approve-registration/:id", async (req, res) => {
  try {
    const playerId = req.params.id;

    // Find the player by ID
    const player = await RegisteredPlayers.findById(playerId);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Perform any necessary checks for admin approval

    // Update the approval status to "Approved"
    player.approvalStatus = "Approved";
    await player.save();

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred, try again!😪" });
  }
});
router.get("/get-approvedPlayers", async (req, res) => {
  try {
    const approvedPlayers = await RegisteredPlayers.find({ approvalStatus: "Approved" });
    res.status(200).json({ success: true, approvedPlayers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch the approved players 😓" });
  }
});


router.get("/get-registeredPlayers", async (req, res) => {
  try {
    const registeredPlayers = await RegisteredPlayers.find({ approvalStatus: "Pending" });
    res.status(200).json({ success: true, registeredPlayers });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch the registered players😓" });
  }
});

module.exports = router;
