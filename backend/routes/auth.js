import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// In-memory storage fallback when DB is not connected
export const inMemoryUsers = new Map();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        age,
        gender
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          isAdmin: user.isAdmin || false
        }
      });
    }

    // In-memory fallback
    if (inMemoryUsers.has(email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();
    const isAdmin = inMemoryUsers.size === 0;

    const user = {
      _id: userId,
      name,
      email,
      password: hashedPassword,
      age: parseInt(age),
      gender,
      isAdmin
    };

    inMemoryUsers.set(email, user);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          isAdmin: user.isAdmin || false,
          hasProfile: !!(user.height && user.weight)
        }
      });
    }

    // In-memory fallback FIX: ensure user is retrieved correctly
    const user = inMemoryUsers.get(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        isAdmin: user.isAdmin || false,
        hasProfile: !!(user.height && user.weight)
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create admin user
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin: true,
        age: 25,
        gender: 'other'
      });

      await admin.save();

      const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      return res.status(201).json({
        message: 'Admin created successfully',
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          isAdmin: true
        }
      });
    }

    // In-memory fallback
    if (inMemoryUsers.has(email)) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      age: 25,
      gender: 'other'
    };

    inMemoryUsers.set(email, admin);

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.status(201).json({
      message: 'Admin created successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: true
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
