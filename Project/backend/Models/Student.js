const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // This line is necessary to define the Schema

// Define the Activity schema
const ActivitySchema = new Schema({
  activityId: { type: Schema.Types.ObjectId, ref: 'Activity' }, // Reference to Activity
  type: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, required: true },
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  played: { type: Boolean, default: false }, // New field to track if the activity has been played
  failedItems: [
    {
      word: String,  // Word that the student failed
      image: String, // Image that the student failed to match
    }
  ]
});

// Define the Student schema
const StudentSchema = new Schema({
  number: { type: String, required: true, unique: true },
  difficulties: [String],  // Array of difficulties
  activities: [ActivitySchema]  // Array of activities associated with the student
});

// Export the model for Student
module.exports = mongoose.model('Student', StudentSchema);
