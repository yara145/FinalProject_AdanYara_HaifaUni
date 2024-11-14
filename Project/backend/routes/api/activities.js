const express = require('express');
const mongoose = require('mongoose');  // Add this line

const router = express.Router();
const Activity = require('../../Models/Activity');
const Student = require('../../Models/Student'); // Make sure the path is correct
const CustomActivity = require('../../Models/CustomActivity'); // For custom activities

// Create an Activity
router.post('/create-activity', async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Received Data:", req.body);

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

// Fetch specific activity for a student
router.get('/activity/:id/:studentId/:level', async (req, res) => {
  const { id: activityId, studentId, level } = req.params;
  console.log("Route hit - activity with ID, studentId, level");
  console.log("Activity ID:", activityId);
  console.log("Student ID:", studentId);
  console.log("Level:", level);

  try {
    const activity = student.activities.find(a => a.activityId.equals(new mongoose.Types.ObjectId(activityId)) && a.level === level);

    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/letteractivity/:id/:studentId/:level', async (req, res) => {
  const { id: activityId, studentId, level } = req.params;
  console.log("Route hit - activity with ID, studentId, level");
  console.log("Activity ID:", activityId);
  console.log("Student ID:", studentId);
  console.log("Level:", level);

  try {
    // Fetch the activity using the activityId from the Activity collection (not student-specific)
    const activity = await Activity.findById(activityId); // Fetch the Activity by ID from the Activity collection
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Return the activity data along with the level
    res.status(200).json({ ...activity.toObject(), level: parseInt(level) });
  } catch (err) {
    console.error('Error fetching activity:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Fetch specific custom activity for a student
router.get('/custom-activity/:activityId/:studentId/:level', async (req, res) => {
  const { activityId, studentId, level } = req.params;
  
  try {
    const activity = await CustomActivity.findById(activityId); // Fetch the CustomActivity by ID
    if (!activity) {
      return res.status(404).json({ message: 'Custom activity not found' });
    }

    res.status(200).json({ ...activity.toObject(), level: parseInt(level) });
  } catch (err) {
    console.error('Error fetching custom activity:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});// Endpoint to save activity result
// Endpoint to save activity result
router.post('/save-result', async (req, res) => {
  const { activityId, studentId, level, score, completed, played, failedItems } = req.body;

  // Log the received studentId, activityId, and level
  console.log('Received studentId:', studentId);
  console.log('Received activityId:', activityId);
  console.log('Received level:', level);

  try {
    // Fetch the student from the database
    const student = await Student.findById(studentId);
    
    if (!student) {
      console.log('Student not found with studentId:', studentId);
      return res.status(404).json({ message: `Student with ID ${studentId} not found` });
    }

    // Log the entire student document to verify their activities
    console.log('Full student document:', student);
    console.log('Student activities:', student.activities);

    // Log each activityId in the student's activities for comparison
    const activity = student.activities.find(a => {
      // Convert both activityId from student and request to strings for comparison
      const studentActivityIdStr = a.activityId.toString();  // Convert student activityId to string
      const requestActivityIdStr = activityId.toString();    // Convert request activityId to string

      // Print the comparison for each activityId
      console.log("Comparing activityId:", studentActivityIdStr);  // Log the student activityId (as string)
      console.log("Activity ID from request:", requestActivityIdStr); // Log the activityId from the request (as string)

      // Convert both levels to strings for comparison
      const studentLevelStr = a.level.toString();  // Convert student level to string
      const requestLevelStr = level.toString();    // Convert request level to string

      console.log("level 1:", studentLevelStr); 
      console.log("level 2:", requestLevelStr); 

      // Compare the activityIds and levels
      console.log("Comparison result:", studentActivityIdStr === requestActivityIdStr && studentLevelStr === requestLevelStr); // Log result of comparison
      return studentActivityIdStr === requestActivityIdStr && studentLevelStr === requestLevelStr;
    });

    console.log('Found activity:', activity); // Log the found activity

    if (!activity) {
      console.log('Activity not found for student with ID:', studentId);
      return res.status(404).json({ message: 'Activity not found for student' });
    }

    // Update the activity with the result
    activity.score = score;
    activity.completed = completed;
    activity.played = played;  // Save the played field
    activity.failedItems = failedItems; // Save the failed items

    // Save the updated student document
    await student.save();
    res.status(200).json({ message: 'Activity result saved successfully', activity });
  } catch (err) {
    console.error('Error saving activity result:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a Custom Activity
router.post('/create-custom-activity', async (req, res) => {
  try {
    // Log the received data for debugging
    console.log("Received data:", req.body);

    const { name, type, words, background, level } = req.body;

    // Create a new custom activity using the data from the request body
    const newCustomActivity = new CustomActivity({
      name,
      type,
      level,
      wordsWithPhotos: words.map(entry => ({
        word: entry.word,
        correctImage: entry.correctImage,
        otherImages: entry.otherImages
      })),
      background,
    });

    // Save the activity and send a response
    await newCustomActivity.save();
    res.status(201).json(newCustomActivity);
  } catch (error) {
    console.error('Error creating custom activity:', error);
    res.status(400).json({ message: 'Error creating custom activity', error: error.message });
  }
});

// Fetch all Custom Activities
router.get('/fetch-custom-activities', async (req, res) => {
  try {
    const customActivities = await CustomActivity.find();
    res.status(200).json(customActivities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching custom activities', error: error.message });
  }
});
router.post('/create-activity-three', async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Received Data:", req.body);

    const newActivity = new Activity({
      name: req.body.name,
      type: req.body.type,
      wordsWithPhotos: req.body.wordsWithPhotos,  // Ensure the wordsWithPhotos is correctly populated
      background: req.body.background,
      level: req.body.level
    });

    // Save the new activity to MongoDB
    await newActivity.save();

    res.status(201).json(newActivity);  // Respond with the saved activity
  } catch (error) {
    res.status(400).json({ message: 'Error creating activity', error: error.message });
  }
});
router.put('/api/activities/:activityId', async (req, res) => {
  const { activityId } = req.params;
  const { level, wordsWithPhotos } = req.body;  // You can also include words with photos if needed

  try {
    // Find the activity by its ID and update the level (and optionally wordsWithPhotos)
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        $set: { level, wordsWithPhotos },  // Set the level and wordsWithPhotos if they are provided
      },
      { new: true }  // Return the updated document
    );

    if (!updatedActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Return the updated activity
    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
