'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Users, Utensils, Activity, Plus, Trash2, Edit } from 'lucide-react';

export default function AdminPanel() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, foods: 0, healthLogs: 0 });
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.isAdmin) {
        router.push('/dashboard');
        return;
      }
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://major-annapurnaai-n7dr.onrender.com/api";

      const [statsRes, foodsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/foods`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setFoods(foodsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 403) router.push('/dashboard');
    }
  };

  const deleteFood = async (id) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://major-annapurnaai-n7dr.onrender.com/api";

      await axios.delete(`${API_URL}/admin/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFoods(foods.filter(f => f._id !== id));
      alert('Food deleted successfully!');
    } catch (error) {
      alert('Error deleting food');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ayurveda-light">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-ayurveda-primary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ayurveda-light">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-ayurveda-primary mb-8">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'stats'
                ? 'text-ayurveda-primary border-b-2 border-ayurveda-primary'
                : 'text-gray-600'
            }`}
          >
            Statistics
          </button>

          <button
            onClick={() => setActiveTab('foods')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'foods'
                ? 'text-ayurveda-primary border-b-2 border-ayurveda-primary'
                : 'text-gray-600'
            }`}
          >
            Foods
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'users'
                ? 'text-ayurveda-primary border-b-2 border-ayurveda-primary'
                : 'text-gray-600'
            }`}
          >
            Users
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-ayurveda-primary">{stats.users}</p>
                </div>
                <Users className="h-12 w-12 text-ayurveda-secondary" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Foods</p>
                  <p className="text-3xl font-bold text-ayurveda-primary">{stats.foods}</p>
                </div>
                <Utensils className="h-12 w-12 text-ayurveda-secondary" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Health Logs</p>
                  <p className="text-3xl font-bold text-ayurveda-primary">{stats.healthLogs}</p>
                </div>
                <Activity className="h-12 w-12 text-ayurveda-secondary" />
              </div>
            </div>
          </div>
        )}

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-ayurveda-primary">Food Items</h2>
              <button
                onClick={() => router.push('/admin/add-food')}
                className="bg-ayurveda-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-ayurveda-green"
              >
                <Plus className="h-5 w-5" />
                <span>Add Food</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map(food => (
                <div key={food._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-ayurveda-primary mb-2">{food.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{food.category}</p>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/edit-food/${food._id}`)}
                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 hover:bg-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => deleteFood(food._id)}
                        className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-ayurveda-primary mb-6">Users</h2>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-ayurveda-primary text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Age</th>
                    <th className="px-6 py-3 text-left">Gender</th>
                    <th className="px-6 py-3 text-left">Admin</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.age || 'N/A'}</td>
                      <td className="px-6 py-4">{user.gender || 'N/A'}</td>
                      <td className="px-6 py-4">
                        {user.isAdmin ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Yes</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
