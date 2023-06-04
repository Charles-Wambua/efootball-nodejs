
const express = require('express');
const router = express.Router();
const Fixture = require('../schemas/postFixturesSchema'); // Assuming you have a Fixture model

router.post('/postFixtures', async (req, res) => {
  try {
    const fixturesData = req.body;

    // Assuming you have a Fixture model with appropriate schema
    const fixtures = await Fixture.create(fixturesData);

    res.status(201).json({ success: true, fixtures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to store fixtures in the database.' });
  }
});
router.get('/getFixtures', async (req, res) => {
  try {
    // Assuming you have a Fixture model with appropriate schema
    const fixtures = await Fixture.find();
    res.status(200).json({ success: true, fixtures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch fixtures from the database.' });
  }
});


module.exports = router;
