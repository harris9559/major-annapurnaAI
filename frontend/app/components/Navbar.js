'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);

      const token = localStorage.getItem('token');

      // SAFE parse for user object
      let user = {};
      try {
        user = JSON.parse(localStorage.getItem('user')) || {};
      } catch {
        user = {};
      }

      setIsLoggedIn(!!token);
      setIsAdmin(user.isAdmin || false);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      window.location.href = '/';
    }
  };

  // Avoid hydration mismatch
  if (!isClient) {
    return (
      <nav className="bg-ayurveda-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-ayurveda-beige" />
                <span className="text-2xl font-bold text-ayurveda-beige">AnnapurnaAI</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-ayurveda-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-ayurveda-beige" />
              <span className="text-2xl font-bold text-ayurveda-beige">AnnapurnaAI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-ayurveda-beige transition">Home</Link>
            <Link href="/dashboard" className="hover:text-ayurveda-beige transition">Dashboard</Link>
            <Link href="/remedies" className="hover:text-ayurveda-beige transition">Remedies</Link>
            <Link href="/chatbot" className="hover:text-ayurveda-beige transition">Chatbot</Link>

            {isAdmin && (
              <Link href="/admin" className="hover:text-ayurveda-beige transition font-semibold">Admin</Link>
            )}

            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="bg-ayurveda-accent px-4 py-2 rounded-lg hover:bg-ayurveda-brown transition">
                Logout
              </button>
            ) : (
              <Link href="/login" className="bg-ayurveda-accent px-4 py-2 rounded-lg hover:bg-ayurveda-brown transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-ayurveda-green">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

            <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-ayurveda-primary rounded">Home</Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-ayurveda-primary rounded">Dashboard</Link>
            <Link href="/remedies" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-ayurveda-primary rounded">Remedies</Link>
            <Link href="/chatbot" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-ayurveda-primary rounded">Chatbot</Link>

            {isAdmin && (
              <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-ayurveda-primary rounded font-semibold">Admin</Link>
            )}

            {isLoggedIn ? (
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }} 
                className="block w-full text-left px-3 py-2 hover:bg-ayurveda-primary rounded">
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-ayurveda-primary rounded">
                Login
              </Link>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
