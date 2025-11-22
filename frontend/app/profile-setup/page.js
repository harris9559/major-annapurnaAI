'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Activity, Heart, TrendingUp, AlertCircle } from 'lucide-react';

export default function ProfileSetup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    activityLevel: 'moderate',
    diseases: []
  });
  const [diseaseInput, setDiseaseInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, []);

  const commonDiseases = [
    'diabetes', 'hypertension', 'arthritis', 'asthma',
    'thyroid', 'obesity', 'insomnia', 'acidity', 'constipation'
  ];

  const handleAddDisease = (disease) => {
    if (!formData.diseases.includes(disease)) {
      setFormData({ ...formData, diseases: [...formData.diseases, disease] });
    }
  };

  const handleRemoveDisease = (disease) => {
    setFormData({ ...formData, diseases: formData.diseases.filter(d => d !== disease) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      // 🔥 FIXED API URL HERE
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

      await axios.put(
        `${API_URL}/user/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayurveda-light">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-ayurveda-secondary" />
            <h2 className="mt-6 text-3xl font-bold text-ayurveda-primary">
              Complete Your Health Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Help us personalize your Ayurvedic recommendations
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ayurveda-primary mb-2">
                  Height (cm)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-secondary"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ayurveda-primary mb-2">
                  Weight (kg)
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-secondary"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ayurveda-primary mb-2">
                Activity Level
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-secondary"
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              >
                <option value="sedentary">Sedentary (little to no exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (intense daily)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ayurveda-primary mb-2">
                Health Conditions
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {commonDiseases.map((disease) => (
                  <button
                    key={disease}
                    type="button"
                    onClick={() => handleAddDisease(disease)}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      formData.diseases.includes(disease)
                        ? 'bg-ayurveda-secondary text-white'
                        : 'bg-ayurveda-beige text-ayurveda-brown hover:bg-ayurveda-accent'
                    }`}
                  >
                    {disease}
                  </button>
                ))}
              </div>

              {formData.diseases.length > 0 && (
                <div className="bg-ayurveda-light p-4 rounded-lg">
                  <p className="text-sm font-medium text-ayurveda-primary mb-2">Selected Conditions:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.diseases.map((disease) => (
                      <span
                        key={disease}
                        className="bg-ayurveda-secondary text-white px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {disease}
                        <button
                          type="button"
                          onClick={() => handleRemoveDisease(disease)}
                          className="ml-2 text-white hover:text-red-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <p className="text-sm text-blue-800">
                Your health information is confidential and will be used only to provide personalized Ayurvedic recommendations.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ayurveda-primary hover:bg-ayurveda-green text-white py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Saving Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
