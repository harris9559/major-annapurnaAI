import express from 'express';
import Food from '../models/Food.js';
import { authMiddleware } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// In-memory foods storage
let inMemoryFoods = [];

// LOWERCASE all diseases inside seed array
const ayurvedicFoods = [
  {
    ...{ 
      name: 'Turmeric Golden Milk',
      category: 'Beverage',
      diseases: ['inflammation', 'arthritis', 'cold', 'immunity'].map(d => d.toLowerCase()),
      benefits: ['Anti-inflammatory', 'Boosts immunity', 'Improves digestion', 'Promotes sleep'],
      ayurvedicProperties: {
        rasa: ['bitter', 'pungent'],
        guna: ['light', 'dry'],
        virya: 'hot',
        vipaka: 'pungent'
      },
      ingredients: ['Turmeric powder', 'Milk', 'Black pepper', 'Honey', 'Cinnamon'],
      preparation: 'Heat milk, add 1 tsp turmeric, pinch of black pepper, cinnamon. Simmer 5 min. Add honey when warm.',
      image: 'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=400',
      featured: true
    }
  },

  // repeat this change for ALL items (lowercase diseases)
  // --- I have applied automatically below ---
];

// AUTO LOWERCASE ALL DISEASES
ayurvedicFoods.forEach(food => {
  food.diseases = food.diseases.map(d => d.toLowerCase());
});


// ===========================
// SEED ROUTE
// ===========================
router.get('/seed', async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      await Food.deleteMany({});
      const foods = await Food.insertMany(ayurvedicFoods);
      return res.json({ message: 'Database seeded', count: foods.length });
    }

    // In-memory seed
    inMemoryFoods = ayurvedicFoods.map((food, i) => ({
      ...food,
      _id: (i + 1).toString()
    }));

    res.json({ message: 'In-memory storage seeded', count: inMemoryFoods.length });

  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
});


// ===========================
// FEATURED FOODS
// ===========================
router.get('/featured', async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const foods = await Food.find({ featured: true }).limit(6);
      return res.json(foods);
    }

    if (inMemoryFoods.length === 0) {
      inMemoryFoods = ayurvedicFoods.map((food, index) => ({
        ...food,
        _id: (index + 1).toString()
      }));
    }

    const foods = inMemoryFoods.filter(f => f.featured).slice(0, 6);
    res.json(foods);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ===========================
// RECOMMEND FOOD
// ===========================
router.get('/recommend', authMiddleware, async (req, res) => {
  try {
    const { disease } = req.query;
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {

      let query = {};
      if (disease && disease !== 'all') {
        query = { diseases: { $in: [disease.toLowerCase()] } };
      }

      const foods = await Food.find(query).limit(20);
      return res.json(foods);
    }

    // Memory mode auto-seed
    if (inMemoryFoods.length === 0) {
      inMemoryFoods = ayurvedicFoods.map((food, index) => ({
        ...food,
        _id: (index + 1).toString()
      }));
    }

    let foods = inMemoryFoods;

    if (disease && disease !== 'all') {
      foods = inMemoryFoods.filter(f =>
        f.diseases.includes(disease.toLowerCase())
      );
    }

    res.json(foods.slice(0, 20));

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ===========================
// GET ALL FOODS
// ===========================
router.get('/all', async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const foods = await Food.find({});
      return res.json(foods);
    }

    if (inMemoryFoods.length === 0) {
      inMemoryFoods = ayurvedicFoods.map((food, index) => ({
        ...food,
        _id: (index + 1).toString()
      }));
    }

    res.json(inMemoryFoods);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ===========================
// REMEDY OF DAY
// ===========================
router.get('/remedy-of-day', async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const count = await Food.countDocuments();
      const random = Math.floor(Math.random() * count);
      const remedy = await Food.findOne().skip(random);
      return res.json(remedy);
    }

    if (inMemoryFoods.length === 0) {
      inMemoryFoods = ayurvedicFoods.map((food, i) => ({
        ...food,
        _id: (i + 1).toString()
      }));
    }

    const random = Math.floor(Math.random() * inMemoryFoods.length);
    res.json(inMemoryFoods[random]);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ===========================
// ADD FOOD (Admin)
// ===========================
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, category, diseases, benefits, ayurvedicProperties, ingredients, preparation, image, featured } = req.body;
    const isDBConnected = mongoose.connection.readyState === 1;

    const sanitizedDiseases = diseases.map(d => d.toLowerCase());

    if (isDBConnected) {
      const food = new Food({
        name,
        category,
        diseases: sanitizedDiseases,
        benefits,
        ayurvedicProperties,
        ingredients,
        preparation,
        image,
        featured: featured || false
      });
      await food.save();
      return res.status(201).json({ message: 'Food added successfully', food });
    }

    // In-memory
    const newFood = {
      _id: (inMemoryFoods.length + 1).toString(),
      name,
      category,
      diseases: sanitizedDiseases,
      benefits,
      ayurvedicProperties,
      ingredients,
      preparation,
      image,
      featured: featured || false
    };

    inMemoryFoods.push(newFood);

    res.status(201).json({ message: 'Food added to memory', food: newFood });

  } catch (error) {
    res.status(500).json({ message: 'Error adding food', error: error.message });
  }
});

export default router;
export { inMemoryFoods };
