const express = require("express");
const router = express.Router();
const UserProfile = require("../schemas/profileSchema");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const jwt = require("jsonwebtoken");

cloudinary.config({
  cloud_name: "charleswambua",
  api_key: "698412892359667",
  api_secret: "rIAE9A4gsBJ8T3N3Y8nlh6o7sAQ",
});
router.use(express.json());

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Efootball",
    format: async (req, file) => "png",
    public_id: (req, file) => Date.now().toString(),
  },
});
const upload = multer({ storage });

// POST route to create a user profile
router.post("/addProfile", upload.single("photo"), async (req, res) => {
  try {
    const { userName, number } = req.body;
    const photo = req.file.path; // Assuming the uploaded file path is accessible from req.file.path

    // Check if the photo field is provided
    if (!photo) {
      return res.status(400).json({ error: "Photo is required" });
    }

    // Create a new UserProfile instance
    const userProfile = new UserProfile({
      photo,
      userName,
      number,
    });

    // Save the user profile to the database
    await userProfile.save();

    // Store the user ID in localStorage
    const userId = userProfile._id.toString();
    const token = jwt.sign({ userId: userProfile._id }, "secret-key", {
      expiresIn: "1h", // Token expiration time
    });
    res.status(201).json({ message: "User profile created successfully", userId, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the user profile" });
  }
});

module.exports = router;
