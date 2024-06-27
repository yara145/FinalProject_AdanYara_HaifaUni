// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let users = [];

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
  const { username, avatar } = req.body;
  const user = users.find(user => user.username === username);
  if (user) {
    user.avatar = avatar;
    res.status(200).json({ message: 'Avatar set successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
