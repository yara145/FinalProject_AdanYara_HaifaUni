const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Destination folder: uploads/');
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    console.log('Generated filename:', uniqueName);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define the Student model
const Student = require('./Models/Student');

// Fetch Students endpoint
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    console.log('Fetched students:', students);
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Student endpoint
app.post('/api/add-student', async (req, res) => {
  const { number, difficulties } = req.body;
  try {
    const student = new Student({ number, difficulties });
    await student.save();
    console.log('Student added:', student);
    res.status(201).json(student);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Login endpoint
app.post('/api/student-login', async (req, res) => {
  const { number } = req.body;
  try {
    const student = await Student.findOne({ number });
    if (!student) {
      console.log('Student not found:', number);
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ firstLogin: !student.avatar });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to upload images
app.post('/api/activities/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'File uploaded successfully', file: req.file.path });
});

// Endpoint to fetch uploaded images
app.get('/api/activities/images', async (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Unable to scan directory:', err);
      return res.status(500).json({ message: 'Unable to fetch images' });
    }

    // Return an array of image URLs
    const imageUrls = files.map(file => ({
      name: file,
      src: `http://localhost:5000/uploads/${file}`
    }));

    res.status(200).json(imageUrls);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
