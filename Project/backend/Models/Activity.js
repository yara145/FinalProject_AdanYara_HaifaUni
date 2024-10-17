// /models/Activity.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },  // Arabic name added by teacher
  type: { type: String, required: true },  // Type (e.g., 'word-shuffle')
  level: { type: Number, default: 1 },  // Activity starts at level 1
  wordsWithPhotos: [
    {
      word: { type: String, required: true },
      photo: { type: String, required: true }
    }
  ],
  background: { type: String },  // Background image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
