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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      fetchUserData();
      fetchHealthStats();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      // 🔥 FIXED
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchHealthStats = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      // 🔥 FIXED
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

      const response = await axios.get(`${API_URL}/health/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddStats = async (e) => {
    e.preventDefault();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      // 🔥 FIXED
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

      await axios.post(
        `${API_URL}/health/log`,
        todayStats,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      fetchHealthStats();
      setTodayStats({ weight: '', waterIntake: '', caloriesConsumed: '', sleep: '' });
    } catch (error) {
      console.error('Error adding stats:', error);
    }
  };

  const calculateHealthScore = () => {
    if (!stats?.today) return 75;
    const { waterIntake = 0, sleep = 0 } = stats.today;
    let score = 50;
    if (waterIntake >= 2000) score += 25;
    if (sleep >= 7) score += 25;
    return Math.min(score, 100);
  };

  if (typeof window === 'undefined') {
    return (
      <div className="min-h-screen bg-ayurveda-light">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-ayurveda-primary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-ayurveda-light">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-ayurveda-primary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = stats.week.reverse().map((log, index) => ({
    day: `Day ${index + 1}`,
    weight: log.weight || 0,
    calories: log.caloriesConsumed || 0
  }));

  return (
    <div className="min-h-screen bg-ayurveda-light">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ayurveda-primary">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Track your wellness journey with Ayurvedic insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Health Score</p>
                <p className="text-3xl font-bold">{calculateHealthScore()}</p>
              </div>
              <Heart className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Water Intake</p>
                <p className="text-3xl font-bold">{stats.today?.waterIntake || 0}ml</p>
              </div>
              <Droplet className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Calories</p>
                <p className="text-3xl font-bold">{stats.today?.caloriesConsumed || 0}</p>
              </div>
              <Flame className="h-12 w-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Sleep</p>
                <p className="text-3xl font-bold">{stats.today?.sleep || 0}h</p>
              </div>
              <Moon className="h-12 w-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Rest of your dashboard stays EXACT same */}
      </div>

      {/* Modal stays same */}
    </div>
  );
}
