// backend/Models/Student.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, required: true },
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

const StudentSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  difficulties: [String], // Change difficulties to an array of strings
  activities: [ActivitySchema]
});

module.exports = mongoose.model('Student', StudentSchema);
