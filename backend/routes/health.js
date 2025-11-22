router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const isDBConnected = mongoose.connection.readyState === 1;
    
    // Normalize into last 7 days ALWAYS
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push({ date, data: null });
    }

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
      const log = logs.find(l => {
        const logDate = new Date(l.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === day.date.getTime();
      });

      day.data = log ? {
        weight: log.weight || 0,
        caloriesConsumed: log.caloriesConsumed || 0,
        waterIntake: log.waterIntake || 0,
        sleep: log.sleep || 0
      } : {
        weight: 0,
        caloriesConsumed: 0,
        waterIntake: 0,
        sleep: 0
      };
    });

    res.json({
      today: last7Days[6].data,
      week: last7Days.map(d => d.data)
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
