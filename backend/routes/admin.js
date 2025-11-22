import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import User from '../models/User.js';
import Food from '../models/Food.js';
import HealthLog from '../models/HealthLog.js';
import { inMemoryUsers } from './auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Fix circular import issue
import * as foodModule from './food.js';
const inMemoryFoods = foodModule.inMemoryFoods;

// ------------------------
// GET ALL USERS
// ------------------------
router.get('/users', adminAuth, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const users = await User.find().select('-password');
      return res.json(users);
    }

    const users = Array.from(inMemoryUsers.values()).map(u => {
      const { password, ...rest } = u;
      return rest;
    });

    return res.json(users);

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ------------------------
// GET ALL FOODS
// ------------------------
router.get('/foods', adminAuth, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const foods = await Food.find();
      return res.json(foods);
    }

    return res.json(inMemoryFoods);

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ------------------------
// DELETE FOOD
// ------------------------
router.delete('/foods/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      await Food.findByIdAndDelete(id);
      return res.json({ message: 'Food deleted successfully' });
    }

    const index = inMemoryFoods.findIndex(f => f._id === id);

    if (index > -1) {
      inMemoryFoods.splice(index, 1);
      return res.json({ message: 'Food deleted successfully' });
    }

    return res.status(404).json({ message: 'Food not found' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ------------------------
// UPDATE FOOD
// ------------------------
router.put('/foods/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const food = await Food.findByIdAndUpdate(id, updateData, { new: true });
      return res.json(food);
    }

    const index = inMemoryFoods.findIndex(f => f._id === id);

    if (index > -1) {
      inMemoryFoods[index] = { ...inMemoryFoods[index], ...updateData };
      return res.json(inMemoryFoods[index]);
    }

    return res.status(404).json({ message: 'Food not found' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ------------------------
// ADMIN STATS
// ------------------------
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const userCount = await User.countDocuments();
      const foodCount = await Food.countDocuments();
      const healthLogCount = await HealthLog.countDocuments();

      return res.json({
        users: userCount,
        foods: foodCount,
        healthLogs: healthLogCount
      });
    }

    return res.json({
      users: inMemoryUsers.size,
      foods: inMemoryFoods.length,
      healthLogs: 0
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
export { inMemoryFoods };
