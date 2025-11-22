import mongoose from 'mongoose';

const healthLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Ensure we always store timestamps in consistent timezone
  date: { type: Date, default: () => new Date() },

  weight: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 },
  caloriesConsumed: { type: Number, default: 0 },
  sleep: { type: Number, default: 0 },
  steps: { type: Number, default: 0 },

  mood: { type: String, default: "neutral" }
});

export default mongoose.model('HealthLog', healthLogSchema);
