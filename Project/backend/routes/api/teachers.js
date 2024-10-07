const express = require('express');
const Teacher = require('../models/Teacher');
const router = express.Router();

// Update badge
router.put('/update-badge/:teacherId', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.teacherId);
    teacher.badge += 1;
    await teacher.save();
    res.status(200).json({ message: 'Badge updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating badge' });
  }
});

module.exports = router;
