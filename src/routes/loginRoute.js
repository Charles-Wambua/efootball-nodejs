const express = require("express");
const router = express.Router();
const UserProfile = require("../schemas/profileSchema");
const jwt = require("jsonwebtoken");

router.use(express.json());

// POST route for user login
router.post("/login", async (req, res) => {
  try {
      const { username, number } = req.body;
      

    // Find the user profile by username and number
    const userProfile = await UserProfile.findOne({ userName: username, number });

    // Check if the user profile exists
    if (!userProfile) {
      return res.status(401).json({ message: "Invalid username or number" });
    }

    // Generate a JWT token
      console.log(userProfile)
    const token = jwt.sign({ userId: userProfile._id }, "secret-key", {
      expiresIn: "1h", // Token expiration time
    });

    // Return the user profile and token
    res.status(200).json({ userId: userProfile._id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

module.exports = router;
