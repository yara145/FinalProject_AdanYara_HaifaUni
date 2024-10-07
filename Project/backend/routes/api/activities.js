// /api/activities.js
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Create an Activity
router.post('/', async (req, res) => {
  const { type, level, difficulty, landType, description } = req.body;
  try {
    const newActivity = new Activity({ type, level, difficulty, landType, description });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: 'Error creating activity', error: error.message });
  }
});

// Fetch all Activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

module.exports = router;
