import express from 'express';
import HealthLog from '../models/HealthLog.js';
import { authMiddleware } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// In-memory fallback storage
const inMemoryHealthLogs = [];

// ========================================================
// ADD HEALTH LOG
// ========================================================
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { weight, waterIntake, caloriesConsumed, sleep, steps, mood } = req.body;
    const isDBConnected = mongoose.connection.readyState === 1;

    // DB MODE
    if (isDBConnected) {
      const healthLog = new HealthLog({
        userId: req.userId,
        weight,
        waterIntake,
        caloriesConsumed,
        sleep,
        steps,
        mood,
        date: new Date()
      });

      await healthLog.save();
      return res.status(201).json(healthLog);
    }

    // IN-MEMORY MODE
    const healthLog = {
      _id: Date.now().toString(),
      userId: req.userId,
      weight: weight || 0,
      waterIntake: waterIntake || 0,
      caloriesConsumed: caloriesConsumed || 0,
      sleep: sleep || 0,
      steps: steps || 0,
      mood: mood || "neutral",
      date: new Date()
    };

    inMemoryHealthLogs.push(healthLog);
    return res.status(201).json(healthLog);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========================================================
// GET LAST 30 LOGS
// ========================================================
router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const logs = await HealthLog.find({ userId: req.userId })
        .sort({ date: -1 })
        .limit(30);

      return res.json(logs);
    }

    // MEMORY MODE
    const logs = inMemoryHealthLogs
      .filter(log => log.userId === req.userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);

    return res.json(logs);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========================================================
// GET STATS (ALWAYS 7 DAYS) — FIXED
// ========================================================
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;

    // Build last 7 days structure
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);

      last7Days.push({
        date: d,
        data: {
          weight: 0,
          caloriesConsumed: 0,
          waterIntake: 0,
          sleep: 0
        }
      });
    }

    // Fetch logs (DB or memory)
    let logs = [];

    if (isDBConnected) {
      logs = await HealthLog.find({
        userId: req.userId,
        date: { $gte: new Date(Date.now() - 7 * 86400000) }
      });
    } else {
      logs = inMemoryHealthLogs.filter(log => log.userId === req.userId);
    }

    // Match logs to days
    logs.forEach(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      const match = last7Days.find(day => day.date.getTime() === logDate.getTime());

      if (match) {
        match.data = {
          weight: log.weight || 0,
          caloriesConsumed: log.caloriesConsumed || 0,
          waterIntake: log.waterIntake || 0,
          sleep: log.sleep || 0
        };
      }
    });

    // Today's stats = last entry
    const todayStats = last7Days[last7Days.length - 1].data;

    res.json({
      today: todayStats,
      week: last7Days.map(day => day.data)
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
