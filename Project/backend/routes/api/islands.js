const express = require('express');
const Island = require('../models/Island');
const router = express.Router();

// Update island levels with activity
router.post('/update-level', async (req, res) => {
  const { islandId, activityId } = req.body;
  try {
    const island = await Island.findById(islandId);
    island.activities.push(activityId);
    await island.save();
    res.status(200).json({ message: 'Island updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating island' });
  }
});

module.exports = router;
