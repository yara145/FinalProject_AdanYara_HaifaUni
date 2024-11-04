const express = require('express');
const router = express.Router();
const Activity = require('../../Models/Activity');

// Create an Activity
router.post('/create-activity', async (req, res) => {
  try {
    const newActivity = new Activity({
      name: req.body.name,
      type: req.body.type,
      wordsWithPhotos: req.body.words,
      background: req.body.background,
      level: req.body.level
    });
    
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
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
// In backend/routes/api/activities.js
router.get('/:activityType', async (req, res) => {
  const { activityType } = req.params;
  try {
    const activities = await Activity.find({ type: activityType });
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
