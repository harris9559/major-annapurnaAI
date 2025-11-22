import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import { inMemoryUsers } from './auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// ========================
// GET PROFILE
// ========================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const user = await User.findById(req.userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Always send structured fields to avoid frontend undefined errors
      const responseUser = {
        ...user._doc,
        height: user.height || 0,
        weight: user.weight || 0,
        diseases: user.diseases || [],
        activityLevel: user.activityLevel || "moderate",
        hasProfile: !!(user.height && user.weight)
      };

      return res.json(responseUser);
    }


    // ========================
    // IN-MEMORY MODE
    // ========================
    let foundUser = null;
    for (const [email, user] of inMemoryUsers.entries()) {
      if (user._id === req.userId) {
        foundUser = { ...user };
        delete foundUser.password;
        break;
      }
    }

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    foundUser.height = foundUser.height || 0;
    foundUser.weight = foundUser.weight || 0;
    foundUser.diseases = foundUser.diseases || [];
    foundUser.activityLevel = foundUser.activityLevel || "moderate";
    foundUser.hasProfile = !!(foundUser.height && foundUser.weight);

    res.json(foundUser);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========================
// UPDATE PROFILE
// ========================
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { height, weight, activityLevel, diseases } = req.body;
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const updated = await User.findByIdAndUpdate(
        req.userId,
        {
          height,
          weight,
          activityLevel,
          diseases
        },
        { new: true }
      ).select('-password');

      const responseUser = {
        ...updated._doc,
        height: updated.height || 0,
        weight: updated.weight || 0,
        diseases: updated.diseases || [],
        activityLevel: updated.activityLevel || "moderate",
        hasProfile: !!(updated.height && updated.weight)
      };

      return res.json(responseUser);
    }

    // ========================
    // IN MEMORY MODE
    // ========================
    let foundEmail = null;
    for (const [email, user] of inMemoryUsers.entries()) {
      if (user._id === req.userId) {
        foundEmail = email;
        break;
      }
    }

    if (!foundEmail) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = inMemoryUsers.get(foundEmail);

    user.height = height;
    user.weight = weight;
    user.activityLevel = activityLevel;
    user.diseases = diseases;

    user.hasProfile = !!(user.height && user.weight);

    inMemoryUsers.set(foundEmail, user);

    const cleanUser = { ...user };
    delete cleanUser.password;

    res.json(cleanUser);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
