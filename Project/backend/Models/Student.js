const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  level: Number,
  score: Number
});

const DifficultySchema = new mongoose.Schema({
  name: String,
  levels: [LevelSchema]
});

const StudentSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  difficulties: [DifficultySchema]
});

module.exports = mongoose.model('Student', StudentSchema);
