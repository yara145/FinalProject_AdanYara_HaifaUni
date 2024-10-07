// /models/Activity.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  type: String,
  level: Number,
  difficulty: String,
  landType: String,
  description: String
});

module.exports = mongoose.model('Activity', ActivitySchema);
