const express = require('express');
const router = express.Router();
const Activity = require('../../Models/Activity');
const Student = require('../../Models/Student'); // Make sure the path is correct

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
router.get('/activity/:id/:studentId/:level', async (req, res) => {
  const { id: activityId, studentId, level } = req.params;
  console.log("Route hit - activity with ID, studentId, level");
  console.log("Activity ID:", activityId);
  console.log("Student ID:", studentId);
  console.log("Level:", level);

  try {
      const activity = await Activity.findById(mongoose.Types.ObjectId(activityId));
      if (!activity) return res.status(404).json({ message: 'Activity not found' });

      res.status(200).json(activity);
  } catch (error) {
      console.error('Error fetching activity:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Endpoint to save activity result
router.post('/save-result', async (req, res) => {
  const { activityId, studentId, level, score, completed } = req.body;
  console.log("Saving activity result:", { activityId, studentId, level, score, completed });

  try {
      const student = await Student.findById(studentId);
      if (!student) {
          console.error('Student not found:', studentId);
          return res.status(404).json({ message: 'Student not found' });
      }

      // Find the activity associated with this student
      const activity = student.activities.find(a => a.activityId.equals(activityId));
      if (!activity) {
          console.error('Activity not found for student:', activityId);
          return res.status(404).json({ message: 'Activity not found' });
      }

      // Update activity details
      activity.score = score;
      activity.completed = completed;

      await student.save(); // Save the updated student document
      console.log('Activity result saved successfully:', activity);
      
      res.status(200).json({ message: 'Activity result saved successfully', activity });
  } catch (error) {
      console.error('Error saving activity result:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

