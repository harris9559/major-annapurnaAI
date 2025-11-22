import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },

  diseases: {
    type: [String],
    default: []
  },

  benefits: {
    type: [String],
    default: []
  },

  ayurvedicProperties: {
    rasa: { type: [String], default: [] },
    guna: { type: [String], default: [] },
    virya: { type: String, default: "" },
    vipaka: { type: String, default: "" }
  },

  ingredients: {
    type: [String],
    default: []
  },

  preparation: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: "https://via.placeholder.com/400x300?text=Ayurveda+Food"
  },

  featured: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Food', foodSchema);
