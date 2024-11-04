// backend/routes/api/students.js
const express = require('express');
const router = express.Router();
const Student = require('../../Models/Student')
const Activity = require('../../Models/Activity');
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
// Student Login endpoint// Student Login endpoint
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

// Initialize activities for the student, setting default levels based on all available activities
// backend/routes/api/students.js
const initializeActivity = async (student) => {
  const allActivities = await Activity.find();  // Fetch all activities from Activity model

  // Ensure each activity type and name combination is added for the student
  allActivities.forEach(activity => {
    if (!student.activities.some(a => a.name === activity.name && a.type === activity.type)) {
      student.activities.push({
        type: activity.type,
        name: activity.name,
        level: activity.level || 1,
        score: 0,
        completed: false,
      });
    }
  });

  await student.save();  // Save the updated student document
};


// Fetch Students endpoint
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});// backend/routes/api/students.js
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
// Add 'students' to the route path
router.get('/students/:studentId/activities/:activityType', async (req, res) => {
  const { studentId, activityType } = req.params;

  console.log("Received studentId:", studentId, "activityType:", activityType);

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const activities = student.activities.filter(a => a.type === activityType);

    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities of this type found for this student' });
    }

    res.status(200).json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Update activity status
router.put('/:studentId/activities/:activityType/:levelId', async (req, res) => {
  const { studentId, activityType, levelId } = req.params;
  const { score, completed } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const activity = student.activityTypes.find(a => a.type === activityType);
    if (!activity) {
      return res.status(404).json({ message: 'Activity type not found' });
    }

    const level = activity.levels.find(l => l.level === parseInt(levelId));
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    level.score = score;
    level.completed = completed;
    await student.save();

    res.status(200).json({ message: 'Activity updated successfully', activity });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
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

module.exports = router;