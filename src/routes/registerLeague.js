const express = require("express");
const router = express.Router();
const RegisteredPlayers = require("../schemas/registeredPlayers");

router.post("/register-league", async (req, res) => {
  try {
    const { username, phoneNumber } = req.body;

    const RegisteredPlayer = new RegisteredPlayers({
      username,
      phoneNumber,
    });
    await RegisteredPlayer.save();
    res.status(201).json({ message: "Registration Successful😊" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred, try again!😪" });
  }
});
router.get("/get-registeredPlayers",async (req,res) => {
  try {
    const registeredPlayers= await RegisteredPlayers.find();
    res.status(200).json({success: true, registeredPlayers})
  } catch (error) {
    console.error(error)
    res.status(500).json({success: false, error:'Failed t fetch the regisered players😓'})
  }
})
module.exports = router;
