const express = require("express");
const router = express.Router();
const multer = require("multer");
const Result = require("../schemas/resultsSchema");
const Team = require("../schemas/teamSchema");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

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

// Helper function to calculate and update the standings in the database
const updateStandingsInDatabase = async (standings) => {
  try {
    for (let i = 0; i < standings.length; i++) {
      const team = standings[i];
      await Team.findOneAndUpdate(
        { team: team.team },
        {
          $set: {
            played: team.played,
            won: team.won,
            drawn: team.drawn,
            lost: team.lost,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            goalDifference: team.goalDifference,
            points: team.points,
            rank: team.rank,
          },
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Error updating standings:", error);
    throw error;
  }
};

// Helper function to calculate the standings
const calculateStandings = (results) => {
  const teams = {};

  results.forEach((result) => {
    const { player, opponent, playerScore, opponentScore } = result;

    if (!teams[player]) {
      teams[player] = {
        team: player,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    }

    if (!teams[opponent]) {
      teams[opponent] = {
        team: opponent,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    }

    teams[player].played++;
    teams[player].goalsFor += playerScore;
    teams[player].goalsAgainst += opponentScore;
    teams[player].goalDifference = teams[player].goalsFor - teams[player].goalsAgainst;

    teams[opponent].played++;
    teams[opponent].goalsFor += opponentScore;
    teams[opponent].goalsAgainst += playerScore;
    teams[opponent].goalDifference = teams[opponent].goalsFor - teams[opponent].goalsAgainst;

    if (playerScore > opponentScore) {
      teams[player].won++;
      teams[player].points += 3;
      teams[opponent].lost++;
    } else if (playerScore < opponentScore) {
      teams[opponent].won++;
      teams[opponent].points += 3;
      teams[player].lost++;
    } else {
      teams[player].drawn++;
      teams[player].points += 1;
      teams[opponent].drawn++;
      teams[opponent].points += 1;
    }
  });

  const standings = Object.values(teams);
  standings.sort((a, b) => {
    // Compare points
    if (a.points !== b.points) {
      return b.points - a.points;
    }

    // If points are equal, compare goal difference
    if (a.goalDifference !== b.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }

    // If goal difference is also equal, compare goals scored
    if (a.goalsFor !== b.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }

    // If goals scored are also equal, compare team names (alphabetically)
    return a.team.localeCompare(b.team);
  });

  standings.forEach((team, index) => {
    team.rank = index + 1;
  });

  return standings;
};


router.post("/results", upload.single("image"), async (req, res) => {
  try {
    const { filename } = req.file; // Retrieve the filename of the uploaded image
    const { player, opponent, playerScore, opponentScore } = req.body;

    // Create a new Result object with the image filename and other fields
    const result = new Result({
      image: filename,
      player,
      opponent,
      playerScore,
      opponentScore,
    });

    await result.save();

    // Retrieve all the results from the database
    const allResults = await Result.find();

    // Calculate the updated standings based on the results
    const updatedStandings = calculateStandings(allResults);

    // Update the standings in the Team schema and save the documents
    await updateStandingsInDatabase(updatedStandings);

    // Respond with a success message
    res.status(200).json({
      message: "Screenshot uploaded, result created, and standings updated successfully.", result: {
        player,
        opponent,
        playerScore,
        opponentScore,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the screenshot and updating standings." });
  }
});



module.exports = router;
