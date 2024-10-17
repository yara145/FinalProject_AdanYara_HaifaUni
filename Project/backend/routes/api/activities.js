const express = require('express');
const router = express.Router();
const Activity = require('../../Models/Activity');

// Create an Activity
router.post('/create-activity', async (req, res) => {
  try {
    console.log("Incoming activity data:", req.body); // Log incoming request data

    const newActivity = new Activity({
      name: req.body.name,
      type: req.body.type,
      wordsWithPhotos: req.body.words,
      background: req.body.background,
      level: req.body.level
    });
    
    await newActivity.save();
    console.log("Activity saved successfully:", newActivity); // Log success message
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error creating activity:', error); // Log error message
    res.status(400).json({ message: 'Error creating activity', error: error.message });
  }
});


// Fetch all Activities
router.get('/fetch-activities', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

module.exports = router;
