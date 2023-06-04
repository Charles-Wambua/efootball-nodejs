const express = require("express");
const router = express.Router();
const Team = require("../schemas/teamSchema");


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

router.get("/get-results", async (req, res) => {
  try {
    // Retrieve all the teams from the database
    const teams = await Team.find();

    // Calculate the standings and rank the teams
    const standings = calculateStandings(teams);

    // Respond with the ranked standings
    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving the results." });
  }
});

module.exports = router;
