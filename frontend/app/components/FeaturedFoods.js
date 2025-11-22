'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

export default function FeaturedFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        // 🔥 FIXED API URL LINE
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

        const response = await axios.get(`${API_URL}/food/featured`);
        setFoods(response.data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-ayurveda-light">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-ayurveda-primary">Loading featured foods...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-ayurveda-beige text-ayurveda-brown px-4 py-2 rounded-full text-sm font-semibold">
              Popular Choices
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ayurveda-primary mb-4">
            Featured Ayurvedic Foods
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Time-tested remedies for holistic wellness and natural healing
          </p>
        </div>

        {/* Featured Image Banner */}
        <div className="mb-16 relative group overflow-hidden rounded-3xl shadow-2xl">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <img
              src="https://srisriayurvedahospital.org/wp-content/uploads/2024/04/Blog-Cover-3-1024x577.jpg"
              alt="Boost Your Immunity with Ayurvedic Foods"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ayurveda-primary/90 via-ayurveda-primary/70 to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl px-8 md:px-16">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <span className="text-white text-sm font-semibold">Immunity Boosting</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Boost Your Immunity with Ayurvedic Foods
                </h3>
                <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                  Discover powerful natural ingredients that strengthen your immune system, enhance vitality, 
                  and promote overall wellness through ancient Ayurvedic wisdom. These time-tested foods work 
                  in harmony with your body to build lasting health and resilience.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    Natural Defense
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    Holistic Healing
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    Ancient Wisdom
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 w-32 h-32 bg-ayurveda-secondary/30 rounded-tl-full transform translate-x-16 translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foods.map((food, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-ayurveda-light"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-ayurveda-primary mb-2 group-hover:text-ayurveda-secondary transition-colors">
                  {food.name}
                </h3>
                <p className="text-sm text-ayurveda-accent mb-4 font-medium">{food.category}</p>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-ayurveda-green mb-3">Key Benefits:</p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {food.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-ayurveda-secondary mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-ayurveda-light">
                  {food.diseases.slice(0, 3).map((disease, i) => (
                    <span 
                      key={i} 
                      className="bg-ayurveda-beige text-ayurveda-brown text-xs px-3 py-1.5 rounded-full font-medium hover:bg-ayurveda-accent hover:text-white transition-colors cursor-pointer"
                    >
                      {disease}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/remedies" 
            className="inline-block bg-ayurveda-primary hover:bg-ayurveda-green text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Remedies
          </a>
        </div>
      </div>
    </section>
  );
}
