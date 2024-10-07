const TeacherSchema = new mongoose.Schema({
    name: String,
    badge: Number, // Increment as teacher creates activities
    activitiesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }]
  });
  