import express from 'express';
import HealthLog from '../models/HealthLog.js';
import { authMiddleware } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// In-memory health logs storage
const inMemoryHealthLogs = [];

// =========================
// ADD HEALTH LOG
// =========================
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { weight, waterIntake, caloriesConsumed, sleep, steps, mood } = req.body;
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const healthLog = new HealthLog({
        userId: req.userId,
        weight,
        waterIntake,
        caloriesConsumed,
        sleep,
        steps,
        mood
      });

      await healthLog.save();
      res.status(201).json(healthLog);
    } else {
      const healthLog = {
        _id: Date.now().toString(),
        userId: req.userId,
        weight,
        waterIntake,
        caloriesConsumed,
        sleep,
        steps,
        mood,
        date: new Date()
      };

      inMemoryHealthLogs.push(healthLog);
      res.status(201).json(healthLog);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =========================
// GET LAST 30 LOGS
// =========================
router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const logs = await HealthLog.find({ userId: req.userId })
        .sort({ date: -1 })
        .limit(30);
      res.json(logs);
    } else {
      const logs = inMemoryHealthLogs
        .filter(log => log.userId === req.userId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 30);
      res.json(logs);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =========================
// FIXED: GET STATS (7 DAYS ALWAYS)
// =========================
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    // Build 7-day timeline
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      last7Days.push({ date: d, data: null });
    }

    // Load logs from DB or memory
    let logs = [];
    if (isDBConnected) {
      logs = await HealthLog.find({
        userId: req.userId,
        date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).sort({ date: 1 });
    } else {
      logs = inMemoryHealthLogs
        .filter(log => log.userId === req.userId)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Match logs to each day
    last7Days.forEach(day => {
      const match = logs.find(l => {
        const ld = new Date(l.date);
        ld.setHours(0, 0, 0, 0);
        return ld.getTime() === day.date.getTime();
      });

      day.data = match
        ? {
            weight: match.weight || 0,
            caloriesConsumed: match.caloriesConsumed || 0,
            waterIntake: match.waterIntake || 0,
            sleep: match.sleep || 0
          }
        : {
            weight: 0,
            caloriesConsumed: 0,
            waterIntake: 0,
            sleep: 0
          };
    });

    res.json({
      today: last7Days[6].data,
      week: last7Days.map(x => x.data)
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
