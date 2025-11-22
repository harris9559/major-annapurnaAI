'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Droplet, Flame, Moon, Plus } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [todayStats, setTodayStats] = useState({
    weight: '',
    waterIntake: '',
    caloriesConsumed: '',
    sleep: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    fetchUserData();
    fetchHealthStats();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHealthStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/health/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStats = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.post(`${API_URL}/health/log`, todayStats, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(false);
      setTodayStats({ weight: '', waterIntake: '', caloriesConsumed: '', sleep: '' });

      fetchHealthStats();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateHealthScore = () => {
    if (!stats?.today) return 75;
    let score = 50;
    if ((stats.today.waterIntake || 0) >= 2000) score += 25;
    if ((stats.today.sleep || 0) >= 7) score += 25;
    return score;
  };

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-ayurveda-light flex items-center justify-center">
        <Navbar />
        Loading...
      </div>
    );
  }

  // Chart Data
  const chartData = (stats.week || []).map((log, index) => ({
    day: `Day ${index + 1}`,
    weight: log?.weight ?? 0,
    calories: log?.caloriesConsumed ?? 0
  }));

  return (
    <div className="min-h-screen bg-ayurveda-light">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-ayurveda-primary">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-6">Track your wellness journey with Ayurvedic insights</p>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Health Score */}
          <div className="bg-green-600 p-6 rounded-xl text-white shadow">
            <p>Health Score</p>
            <p className="text-3xl font-bold">{calculateHealthScore()}</p>
          </div>

          {/* Water */}
          <div className="bg-blue-600 p-6 rounded-xl text-white shadow">
            <p>Water Intake</p>
            <p className="text-3xl font-bold">
              {stats.today?.waterIntake || 0} ml
            </p>
          </div>

          {/* Calories */}
          <div className="bg-orange-600 p-6 rounded-xl text-white shadow">
            <p>Calories</p>
            <p className="text-3xl font-bold">
              {stats.today?.caloriesConsumed || 0}
            </p>
          </div>

          {/* Sleep */}
          <div className="bg-purple-600 p-6 rounded-xl text-white shadow">
            <p>Sleep</p>
            <p className="text-3xl font-bold">
              {stats.today?.sleep || 0}h
            </p>
          </div>
        </div>

        {/* ADD STATS BUTTON */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-ayurveda-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus /> Add Today’s Stats
          </button>
        </div>

        {/* CHART 1 */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Weight Trend (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line dataKey="weight" stroke="#4CAF50" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CHART 2 */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Calorie Trend (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line dataKey="calories" stroke="#FF5722" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================= */}
      {/* ADD TODAY MODAL */}
      {/* ========================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Today’s Stats</h2>

            <form onSubmit={handleAddStats} className="space-y-4">
              <input
                type="number"
                placeholder="Weight (kg)"
                value={todayStats.weight}
                onChange={(e) => setTodayStats({ ...todayStats, weight: e.target.value })}
                className="border p-2 rounded w-full"
              />

              <input
                type="number"
                placeholder="Water Intake (ml)"
                value={todayStats.waterIntake}
                onChange={(e) => setTodayStats({ ...todayStats, waterIntake: e.target.value })}
                className="border p-2 rounded w-full"
              />

              <input
                type="number"
                placeholder="Calories"
                value={todayStats.caloriesConsumed}
                onChange={(e) =>
                  setTodayStats({ ...todayStats, caloriesConsumed: e.target.value })
                }
                className="border p-2 rounded w-full"
              />

              <input
                type="number"
                placeholder="Sleep (hours)"
                value={todayStats.sleep}
                onChange={(e) => setTodayStats({ ...todayStats, sleep: e.target.value })}
                className="border p-2 rounded w-full"
              />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ayurveda-primary text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
