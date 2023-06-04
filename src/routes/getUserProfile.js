const express = require("express");
const router = express.Router();
const UserProfile = require("../schemas/profileSchema");
const mongoose = require("mongoose");

// GET route to retrieve a user profile
router.get("/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Find the user profile in the database based on the provided ID
    const userProfile = await UserProfile.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the user profile" });
  }
});

module.exports = router;
