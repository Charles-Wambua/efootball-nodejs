const express = require("express");
const router = express.Router();
const UserProfile = require("../schemas/profileSchema"); 

// GET route to retrieve all user profiles
router.get("/profiles", async (req, res) => {
  try {
    // Find all user profiles in the database
    const profiles = await UserProfile.find();

    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the user profiles" });
  }
});

module.exports = router;
