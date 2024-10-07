const IslandSchema = new mongoose.Schema({
    name: String,
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }]
  });
  