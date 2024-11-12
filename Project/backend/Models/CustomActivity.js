// /models/CustomActivity.js
const mongoose = require('mongoose');

const CustomActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },  // Arabic name added by teacher
  type: { type: String, required: true },  // Type (e.g., 'word-image-match')
  level: { type: Number, default: 1 },  // Activity starts at level 1
  wordsWithPhotos: [
    {
      word: { type: String, required: true },  // Word
      correctImage: { type: String, required: true },  // Correct image for the word
      otherImages: [{ type: String }]  // Other images for the word (array of strings)
    }
  ],
  background: { type: String },  // Background image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomActivity', CustomActivitySchema);
