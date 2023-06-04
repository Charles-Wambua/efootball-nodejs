const express = require("express");
const router = express.Router();
const UserProfile = require("../models/UserProfile");

// PUT route to update a user profile
router.put("/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedProfile = req.body;

    // Find the user profile in the database based on the provided ID and update it
    const userProfile = await UserProfile.findByIdAndUpdate(userId, updatedProfile, { new: true });

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the user profile" });
  }
});

// DELETE route to delete a user profile
router.delete("/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user profile in the database based on the provided ID and delete it
    const userProfile = await UserProfile.findByIdAndDelete(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the user profile" });
  }
});

module.exports = router;
