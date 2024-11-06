// backend/Models/Student.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  activityId: { type: Schema.Types.ObjectId, ref: 'Activity' },  // Reference to Activity
  type: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, required: true },
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

const StudentSchema = new Schema({
  number: { type: String, required: true, unique: true },
  difficulties: [String],  // Change difficulties to an array of strings
  activities: [ActivitySchema]
});

module.exports = mongoose.model('Student', StudentSchema);
