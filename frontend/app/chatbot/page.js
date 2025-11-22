'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Namaste! I am your Ayurvedic wellness assistant. How may I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) router.push('/login');
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://major-annapurnaai-n7dr.onrender.com/api";

      const response = await axios.post(
        `${API_URL}/chat/message`,
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = { role: 'bot', content: response.data.message };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'How to improve digestion?',
    'Foods for immunity',
    'Remedies for stress',
    'Better sleep tips'
  ];

  return (
    <div className="min-h-screen bg-ayurveda-light flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-ayurveda-primary mb-2">Ayurvedic Wellness Assistant</h1>
          <p className="text-gray-600">Ask me about foods, herbs, remedies, and wellness practices</p>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'bot' ? 'bg-ayurveda-secondary' : 'bg-ayurveda-accent'
                  }`}
                >
                  {message.role === 'bot' ? <Bot className="h-6 w-6 text-white" /> : <User className="h-6 w-6 text-white" />}
                </div>

                <div
                  className={`flex-1 px-4 py-3 rounded-lg ${
                    message.role === 'bot' ? 'bg-ayurveda-light text-gray-800' : 'bg-ayurveda-primary text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-ayurveda-primary">
                <Bot className="h-6 w-6 animate-pulse" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="bg-ayurveda-beige text-ayurveda-brown px-4 py-2 rounded-full text-sm hover:bg-ayurveda-accent hover:text-white transition"
                >
                  {question}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Ayurvedic remedies, foods, or wellness..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-secondary focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-ayurveda-primary text-white px-6 py-3 rounded-lg hover:bg-ayurveda-green transition disabled:opacity-50 flex items-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
