// backend/routes/api/students.js
const express = require('express');
const router = express.Router();
const Student = require('../../Models/Student')

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
  console.log(`Student login attempt with number: ${number}`);

  try {
    let student = await Student.findOne({ number });

    if (!student) {
      student = new Student({ number });
      await student.save();
    } else {
      student.firstLogin = false;
      await student.save();
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

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
    let student = new Student({ number, difficulties });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
