const express = require('express');
const router = express.Router();
const Student = require('../../Models/Student');
const Activity = require('../../Models/Activity');
const CustomActivity = require('../../Models/CustomActivity');

// Set Avatar endpoint
router.post('/set-avatar', async (req, res) => {
  const { number, avatar } = req.body;
  console.log(`Setting avatar for student number: ${number}`);
  try {
    const student = await Student.findOneAndUpdate({ number }, { avatar }, { new: true });
    if (student) {
      res.status(200).json({ message: 'Avatar set successfully', student });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Login endpoint
router.post('/student-login', async (req, res) => {
  const { number } = req.body;
  try {
    let student = await Student.findOne({ number });

    if (!student) {
      student = new Student({ number });
      await student.save();
    }

    // Initialize activities for the student if needed
    await initializeActivity(student);

    // Respond with studentId and firstLogin
    res.json({ studentId: student._id, firstLogin: !student.avatar });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize activities for the student
const initializeActivity = async (student) => {
  const allActivities = await Activity.find(); // Fetch all regular activities
  const customActivities = await CustomActivity.find(); // Fetch all custom activities

  const activitiesToAdd = [...allActivities, ...customActivities];

  activitiesToAdd.forEach(activity => {
    // Check if the student already has this activity by activityId
    if (!student.activities.some(a => a.activityId && a.activityId.equals(activity._id))) {
      // Only push new activities if they don't exist in the student's activities
      student.activities.push({
        activityId: activity._id, // Store the true activity ID here
        type: activity.type,
        name: activity.name,
        level: activity.level || 1,
        score: 0,
        completed: false,
      });
      console.log("Added Activity with ID:", activity._id, "and Name:", activity.name);
    }
  });

  await student.save(); // Save the updated student document
};

// Fetch Students endpoint
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Student endpoint
router.post('/add-student', async (req, res) => {
  const { number, difficulties = [] } = req.body;

  try {
    console.log("Request body:", req.body); // Log the request body
    
    const student = new Student({
      number,
      difficulties,
      activities: []
    });

    await student.save();
    console.log("Student saved successfully!");
    res.status(201).json(student);
  } catch (err) {
    console.error("Error saving student:", err); // Log the full error details
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Route to fetch activities by type for a student
router.get('/students/:studentId/activities/:activityType', async (req, res) => {
  const { studentId, activityType } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let activities = [];

    if (activityType === 'word-image-match') {
      // Fetch custom activities for word-image-match
      activities = await CustomActivity.find(); // Fetch all custom activities from the database
    } else {
      // Fetch regular activities for other types (like word-shuffle)
      activities = student.activities.filter(a => a.type === activityType);
    }

    if (activities.length === 0) {
      return res.status(404).json({ message: `No activities of type ${activityType} found for this student.` });
    }

    res.status(200).json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch individual custom activity for the student
router.get('/activities/activity/:activityId/:studentId/:level', async (req, res) => {
  const { activityId, studentId, level } = req.params;

  try {
    // Check if activity exists
    let activity = await CustomActivity.findById(activityId);  // Check for custom activity
    if (!activity) {
      activity = await Activity.findById(activityId); // Fallback to regular activity
    }

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ ...activity.toObject(), level: parseInt(level) });
  } catch (err) {
    console.error('Error fetching activity:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update activity status for a student
router.put('/:studentId/activities/:activityType/:activityName', async (req, res) => {
  const { studentId, activityType, activityName } = req.params;
  const { score, completed } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const activity = student.activities.find(a => a.name === activityName && a.type === activityType);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    activity.score = score;
    activity.completed = completed;
    await student.save();

    res.status(200).json({ message: 'Activity updated successfully', activity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch Custom Activity for a student
router.get('/:studentId/activities/:activityType', async (req, res) => {
  const { studentId, activityType } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let activities = [];

    // Check for word-image-match custom activities
    if (activityType === 'word-image-match') {
      activities = await CustomActivity.find(); // Fetch all custom activities from the database
    } else {
      // Fetch regular activities for other types (like word-shuffle)
      activities = student.activities.filter(a => a.type === activityType);
    }

    if (activities.length === 0) {
      return res.status(404).json({ message: `No activities of type ${activityType} found for this student.` });
    }

    // Ensure completed field is added for each activity
    const activitiesWithStatus = activities.map(activity => {
      // Check if activity is completed based on the student's activities
      const isCompleted = student.activities.some(a => a.activityId.toString() === activity._id.toString() && a.completed);
      return {
        ...activity.toObject(),
        completed: isCompleted, // Add completed status
      };
    });

    res.status(200).json(activitiesWithStatus);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Fetch all activities for a specific student
router.get('/:studentId/activities', async (req, res) => {
  const { studentId } = req.params;
  console.log(`Incoming request for student ID: ${studentId}`);

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      console.log(`Student not found with ID: ${studentId}`);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log(`Found student: ${student.number}`);
    res.status(200).json(student.activities);
  } catch (err) {
    console.error('Error fetching activities for student:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



module.exports = router;
