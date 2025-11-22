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
    {
      condition: 'Digestive Issues & Acidity',
      doshaImbalance: 'Pitta aggravation causing excess heat in stomach',
      symptoms: ['Heartburn', 'Bloating', 'Indigestion', 'Acid reflux'],
      remedies: [
        {
          name: 'Cumin-Coriander-Fennel Tea (CCF Tea)',
          ingredients: ['1 tsp cumin seeds', '1 tsp coriander seeds', '1 tsp fennel seeds', '4 cups water'],
          preparation: 'Boil all seeds in water for 10 minutes. Strain and store in thermos.',
          usage: 'Sip throughout the day, especially 30 minutes before meals',
          benefits: 'Improves digestion, reduces bloating, cools pitta'
        },
        {
          name: 'Aloe Vera Juice',
          ingredients: ['2 tbsp fresh aloe vera gel', '1 cup water', 'Pinch of cumin powder'],
          preparation: 'Blend aloe vera gel with water. Add cumin powder.',
          usage: 'Drink on empty stomach in morning',
          benefits: 'Soothes stomach lining, reduces acidity, cooling effect'
        }
      ],
      safetyNotes: ['Use only edible aloe vera', 'Avoid during pregnancy', 'Start with small amounts']
    },
    {
      condition: 'Stress & Anxiety',
      doshaImbalance: 'Vata imbalance causing mental restlessness',
      symptoms: ['Racing thoughts', 'Insomnia', 'Nervousness', 'Fatigue'],
      remedies: [
        {
          name: 'Ashwagandha Moon Milk',
          ingredients: ['1 cup warm milk', '1/2 tsp ashwagandha powder', '1/4 tsp cardamom', '1 tsp ghee', 'Honey to taste'],
          preparation: 'Warm milk with ashwagandha and cardamom. Add ghee and honey.',
          usage: 'Drink 1 hour before bedtime',
          benefits: 'Calms nervous system, promotes sleep, adaptogenic'
        },
        {
          name: 'Brahmi Tea',
          ingredients: ['1 tsp brahmi powder', '1 cup hot water', '1/2 tsp honey'],
          preparation: 'Steep brahmi in hot water for 10 minutes. Strain and add honey.',
          usage: 'Once daily in morning or evening',
          benefits: 'Enhances mental clarity, reduces anxiety, improves memory'
        }
      ],
      safetyNotes: ['Consult healthcare provider if on medications', 'Not for pregnant/nursing women without medical advice']
    },
    {
      condition: 'Joint Pain & Arthritis',
      doshaImbalance: 'Vata aggravation causing dryness and inflammation in joints',
      symptoms: ['Joint stiffness', 'Pain', 'Reduced mobility', 'Swelling'],
      remedies: [
        {
          name: 'Turmeric-Ginger Paste',
          ingredients: ['2 tsp turmeric powder', '1 tsp ginger powder', '1 tsp black pepper', '2 tbsp warm sesame oil'],
          preparation: 'Mix all ingredients into a paste. Can be taken internally or applied externally.',
          usage: 'Internal: 1/2 tsp with warm water twice daily. External: Apply to affected joints',
          benefits: 'Anti-inflammatory, pain relief, improves circulation'
        },
        {
          name: 'Guggulu Decoction',
          ingredients: ['1/4 tsp guggulu powder', '1 cup warm water', '1/2 tsp castor oil'],
          preparation: 'Mix guggulu in warm water, add castor oil.',
          usage: 'Once daily before bedtime',
          benefits: 'Reduces inflammation, detoxifies joints, improves flexibility'
        }
      ],
      safetyNotes: ['Avoid if pregnant', 'May interact with blood thinners', 'Consult Ayurvedic practitioner for dosage']
    },
    {
      condition: 'Low Immunity',
      doshaImbalance: 'Weak Ojas (vital essence) and imbalanced doshas',
      symptoms: ['Frequent infections', 'Fatigue', 'Slow recovery', 'Weakness'],
      remedies: [
        {
          name: 'Chyawanprash',
          ingredients: ['1-2 tsp Chyawanprash', '1 cup warm milk or water'],
          preparation: 'Take Chyawanprash directly or mix with warm milk.',
          usage: 'Once daily in morning on empty stomach',
          benefits: 'Boosts immunity, rejuvenates, rich in antioxidants'
        },
        {
          name: 'Triphala Water',
          ingredients: ['1 tsp triphala powder', '1 cup warm water', 'Optional: honey'],
          preparation: 'Mix triphala in warm water. Let it sit for 5 minutes.',
          usage: 'Drink before bedtime or early morning',
          benefits: 'Detoxifies, improves digestion, strengthens immunity'
        }
      ],
      safetyNotes: ['Start with smaller doses', 'Avoid during acute illness', 'Safe for long-term use']
    },
    {
      condition: 'Skin Issues & Acne',
      doshaImbalance: 'Pitta and Kapha imbalance causing heat and toxins',
      symptoms: ['Acne', 'Redness', 'Inflammation', 'Oily skin'],
      remedies: [
        {
          name: 'Neem-Turmeric Face Pack',
          ingredients: ['1 tbsp neem powder', '1/2 tsp turmeric', '2 tbsp rose water', '1 tsp honey'],
          preparation: 'Mix all ingredients into smooth paste.',
          usage: 'Apply to face, leave for 15 minutes, rinse. Use 2-3 times weekly',
          benefits: 'Antibacterial, reduces inflammation, purifies skin'
        },
        {
          name: 'Cooling Coriander Drink',
          ingredients: ['1 tbsp coriander seeds', '2 cups water', 'Juice of 1/2 lime'],
          preparation: 'Soak coriander seeds overnight. Blend with water and strain. Add lime juice.',
          usage: 'Drink in morning on empty stomach',
          benefits: 'Cools pitta, detoxifies blood, clears skin'
        }
      ],
      safetyNotes: ['Patch test before applying', 'Avoid if allergic', 'Internal remedies work best with external care']
    }
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
      // 🔥 FIXED API URL HERE
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
      {/* rest of your file stays exactly the same */}
