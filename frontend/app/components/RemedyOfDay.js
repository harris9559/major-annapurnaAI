'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

export default function RemedyOfDay() {
  const [remedy, setRemedy] = useState(null);

  useEffect(() => {
    const fetchRemedy = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://major-annapurnaai-n7dr.onrender.com/api";

        const response = await axios.get(`${API_URL}/food/remedy-of-day`);
        setRemedy(response.data);
      } catch (error) {
        console.error('Error fetching remedy:', error);
      }
    };

    fetchRemedy();
  }, []);

  if (!remedy) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-ayurveda-secondary via-ayurveda-green to-ayurveda-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Heart className="h-5 w-5 text-white mr-2 animate-pulse" />
            <span className="text-white font-semibold">Featured Today</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Remedy of the Day
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
          <div className="md:flex">
            <div className="md:w-1/2 relative overflow-hidden">
              <img
                src={remedy.image}
                alt={remedy.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div className="md:w-1/2 p-8 md:p-10">
              <h3 className="text-3xl font-bold text-ayurveda-primary mb-4">{remedy.name}</h3>
              <p className="text-ayurveda-accent mb-6 font-medium">{remedy.category}</p>

              <div className="mb-6">
                <h4 className="font-bold text-ayurveda-green mb-3 text-lg">Health Benefits:</h4>
                <ul className="space-y-3">
                  {remedy.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-ayurveda-secondary rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 bg-ayurveda-light p-4 rounded-xl">
                <h4 className="font-bold text-ayurveda-primary mb-2 text-lg">How to Prepare:</h4>
                <p className="text-gray-700 leading-relaxed">{remedy.preparation}</p>
              </div>

              <div>
                <h4 className="font-bold text-ayurveda-primary mb-3 text-lg">Key Ingredients:</h4>
                <div className="flex flex-wrap gap-2">
                  {remedy.ingredients.map((ingredient, i) => (
                    <span 
                      key={i} 
                      className="bg-gradient-to-r from-ayurveda-beige to-ayurveda-light text-ayurveda-brown px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
