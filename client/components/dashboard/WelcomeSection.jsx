//personalized greeting
'use client';
import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

const WelcomeSection = ({ darkMode, userName = 'Seeker' }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className={`p-8 rounded-2xl border ${
      darkMode
        ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
        : 'bg-gradient-to-br from-white to-amber-50 border-amber-200 shadow-lg'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${
            darkMode ? 'text-amber-100' : 'text-slate-900'
          }`}>
            {getGreeting()}, {userName}
          </h1>
          <p className={`text-lg ${
            darkMode ? 'text-amber-200' : 'text-slate-600'
          }`}>
            How can I guide you on your spiritual journey today?
          </p>
        </div>
        <Sparkles className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-orange-500'}`} />
      </div>

      <Link href="/chat">
        <button className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Start a Conversation</span>
        </button>
      </Link>
    </div>
  );
};

export default WelcomeSection;