const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let users = [];
let students = [];

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  users.push({ username, password, avatar: null });
  res.status(201).json({ message: 'User created successfully' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  res.status(200).json({ message: 'Login successful', user });
});

// Set Avatar endpoint
app.post('/api/set-avatar', (req, res) => {
  const { number, avatar } = req.body;
  console.log(`Setting avatar for student number: ${number}`);
  const student = students.find(student => student.number === number);
  if (student) {
    student.avatar = avatar;
    res.status(200).json({ message: 'Avatar set successfully' });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// Student Login endpoint
app.post('/api/student-login', (req, res) => {
  const { number } = req.body;
  console.log(`Student login attempt with number: ${number}`);
  let student = students.find(s => s.number === number);

  if (!student) {
    student = { number, firstLogin: true, difficulties: [], avatar: null };
    students.push(student);
  } else {
    student.firstLogin = false;
  }

  res.json(student);
});

// Fetch Students endpoint
app.get('/api/students', (req, res) => {
  res.status(200).json(students);
});

// Add Student endpoint
app.post('/api/add-student', (req, res) => {
  const student = req.body;
  students.push(student);
  res.status(201).json(student);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
