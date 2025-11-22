import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true 
  },

  age: { 
    type: Number, 
    default: null 
  },

  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'], 
    default: 'other' 
  },

  height: { 
    type: Number, 
    default: null 
  },

  weight: { 
    type: Number, 
    default: null 
  },

  activityLevel: { 
    type: String, 
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'], 
    default: 'moderate' 
  },

  diseases: { 
    type: [String], 
    default: [] 
  },

  isAdmin: { 
    type: Boolean, 
    default: false 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('User', userSchema);
