'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Search, Leaf, AlertCircle, Clock, Droplet } from 'lucide-react';

export default function Remedies() {
  const router = useRouter();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('all');
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeTab, setActiveTab] = useState('foods');

  const diseases = ['all', 'diabetes', 'hypertension', 'arthritis', 'cold', 'immunity', 'digestion', 'stress', 'anxiety'];

  const ayurvedicRemedies = [
    {
      condition: 'Common Cold & Cough',
      doshaImbalance: 'Kapha imbalance with excess mucus production',
      symptoms: ['Runny nose', 'Congestion', 'Cough', 'Mild fever'],
      remedies: [
        {
          name: 'Turmeric Golden Milk',
          ingredients: ['1 cup warm milk', '1/2 tsp turmeric powder', '1/4 tsp black pepper', '1 tsp honey'],
          preparation: 'Heat milk, add turmeric and black pepper. Simmer for 5 minutes. Add honey after cooling slightly.',
          usage: 'Drink before bedtime daily',
          benefits: 'Anti-inflammatory, boosts immunity, soothes throat'
        },
        {
          name: 'Ginger-Tulsi Tea',
          ingredients: ['1 inch fresh ginger', '5-7 tulsi leaves', '1 tsp honey', '1 cup water'],
          preparation: 'Boil water with crushed ginger and tulsi leaves for 10 minutes. Strain and add honey.',
          usage: '2-3 times daily',
          benefits: 'Clears congestion, reduces inflammation, antimicrobial'
        }
      ],
      safetyNotes: ['Avoid if allergic to any ingredient', 'Consult doctor if symptoms persist beyond 7 days']
    },
    // … your other remedy objects remain unchanged …
  ];

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    if (selectedDisease === 'all') {
      setFilteredFoods(foods);
    } else {
      setFilteredFoods(foods.filter(food => food.diseases.includes(selectedDisease)));
    }
  }, [selectedDisease, foods]);

  const fetchFoods = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';
      const response = await axios.get(`${API_URL}/food/all`);
      setFoods(response.data);
      setFilteredFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  return (
    <div className="min-h-screen bg-ayurveda-light">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ayurveda-primary mb-4">Ayurvedic Remedies & Foods</h1>
          <p className="text-lg text-gray-700">Discover natural ways to heal your body</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab('remedies')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'remedies'
                  ? 'bg-ayurveda-primary text-white'
                  : 'text-ayurveda-brown hover:bg-ayurveda-beige'
              }`}
            >
              Home Remedies
            </button>

            <button
              onClick={() => setActiveTab('foods')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'foods'
                  ? 'bg-ayurveda-primary text-white'
                  : 'text-ayurveda-brown hover:bg-ayurveda-beige'
              }`}
            >
              Food Database
            </button>
          </div>
        </div>

        {/* Remedies Section */}
        {activeTab === 'remedies' && (
          <div className="space-y-6">
            {ayurvedicRemedies.map((remedy, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-ayurveda-primary p-6 text-white">
                  <h2 className="text-2xl font-bold">{remedy.condition}</h2>
                  <p className="text-sm mt-1">{remedy.doshaImbalance}</p>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-ayurveda-brown mb-2">Symptoms</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {remedy.symptoms.map((sym, i) => (
                      <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                        {sym}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-ayurveda-brown mb-4">Remedies</h3>
                  <div className="space-y-6">
                    {remedy.remedies.map((r, i) => (
                      <div key={i} className="border-l-4 border-ayurveda-secondary pl-4">
                        <h4 className="text-xl font-semibold mb-2">{r.name}</h4>
                        <p className="font-semibold">Ingredients:</p>
                        <ul className="ml-4 list-disc text-sm mb-3">
                          {r.ingredients.map((ing, idx) => (
                            <li key={idx}>{ing}</li>
                          ))}
                        </ul>

                        <p className="font-semibold">Preparation:</p>
                        <p className="bg-ayurveda-light p-3 rounded-lg mb-3">{r.preparation}</p>

                        <p className="font-semibold">Usage:</p>
                        <p className="bg-blue-50 p-3 rounded-lg mb-3">{r.usage}</p>

                        <p className="font-semibold">Benefits:</p>
                        <p className="bg-green-50 p-3 rounded-lg">{r.benefits}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-6">
                    <AlertCircle className="inline h-5 w-5 mr-2 text-yellow-600" />
                    <span className="font-semibold">Safety Notes:</span>
                    <ul className="ml-6 list-disc text-sm mt-2">
                      {remedy.safetyNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Food Section */}
        {activeTab === 'foods' && (
          <>
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-6 w-6 text-ayurveda-secondary" />
                <h3 className="text-xl font-bold text-ayurveda-primary">Filter Foods by Condition</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {diseases.map((disease) => (
                  <button
                    key={disease}
                    onClick={() => setSelectedDisease(disease)}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                      selectedDisease === disease
                        ? 'bg-ayurveda-primary text-white'
                        : 'bg-ayurveda-beige text-ayurveda-brown hover:bg-ayurveda-accent hover:text-white'
                    }`}
                  >
                    {disease}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredFoods.map((food, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg cursor-pointer"
                  onClick={() => setSelectedFood(food)}
                >
                  <img src={food.image} alt={food.name} className="h-48 w-full object-cover rounded-t-xl" />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-ayurveda-primary">{food.name}</h3>
                    <p className="text-sm text-ayurveda-accent">{food.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Food Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <img src={selectedFood.image} alt={selectedFood.name} className="rounded-xl mb-4" />

            <h2 className="text-3xl font-bold text-ayurveda-primary">{selectedFood.name}</h2>
            <p className="text-ayurveda-accent mb-4">{selectedFood.category}</p>

            <h3 className="text-xl font-bold text-ayurveda-green mb-3">Health Benefits</h3>
            <ul className="ml-4 list-disc mb-4">
              {selectedFood.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <h3 className="text-xl font-bold text-ayurveda-green mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFood.ingredients.map((ing, i) => (
                <span key={i} className="bg-ayurveda-light px-4 py-2 rounded-lg">{ing}</span>
              ))}
            </div>

            <h3 className="text-xl font-bold text-ayurveda-green mb-3">Preparation</h3>
            <p className="bg-ayurveda-light p-4 rounded-lg mb-6">{selectedFood.preparation}</p>

            <button
              onClick={() => setSelectedFood(null)}
              className="w-full bg-ayurveda-primary text-white py-3 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
