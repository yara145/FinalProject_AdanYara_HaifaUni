const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Import activity routes
const activityRoutes = require('./routes/api/activities'); // Ensure correct path

// Setup storage options for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let folderPath = 'uploads/';
    if (req.path.includes('/backgrounds')) {
      folderPath += 'backgrounds';
    } else if (req.path.includes('/activities')) {
      folderPath += 'activities';
    }
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_"); // Sanitize file name
    cb(null, `${uniqueSuffix}-${cleanFileName}`);
  }
});

// Initialize multer with the storage configuration
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
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload endpoint for backgrounds
app.post('/api/upload/backgrounds', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'Background uploaded successfully', file: req.file.path });
});

// Upload endpoint for activities
app.post('/api/upload/activities', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Adjust the path as needed depending on how you access your server
  const filePath = `${req.protocol}://${req.get('host')}/uploads/activities/${req.file.filename}`;
  res.status(200).json({ message: 'Activity uploaded successfully', file: filePath });
});


// Fetch uploaded images endpoint
app.get('/api/activities/images', async (req, res) => {
  const backgroundsPath = path.join(__dirname, 'uploads/backgrounds');
  const activitiesPath = path.join(__dirname, 'uploads/activities');

  try {
    const backgroundFiles = fs.readdirSync(backgroundsPath);
    const activityFiles = fs.readdirSync(activitiesPath);

    const backgroundImages = backgroundFiles.map(file => ({
      name: file,
      src: `http://localhost:5000/uploads/backgrounds/${file}`
    }));

    const activityImages = activityFiles.map(file => ({
      name: file,
      src: `http://localhost:5000/uploads/activities/${file}`
    }));

    res.status(200).json([...backgroundImages, ...activityImages]);
  } catch (err) {
    console.error('Unable to scan directory:', err);
    res.status(500).json({ message: 'Unable to fetch images' });
  }
});

// Use the activity routes
app.use('/api/activities', activityRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Student Login endpoint
app.post('/api/student-login', async (req, res) => {
  const { number } = req.body;
  try {
    const student = await Student.findOne({ number });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ firstLogin: !student.avatar });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

