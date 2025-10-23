//iske andar main dashboard ka page hoga..accessed after sign in
'use client';
import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import TodaysVerse from '@/components/dashboard/TodaysVerse';
import MoodCalendar from '@/components/dashboard/MoodCalendar';
import RecentChats from '@/components/dashboard/RecentChats';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-amber-50' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800'
    }`}>
      <Sidebar darkMode={darkMode} />
      
      <div className="ml-64 p-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all ${
              darkMode 
                ? 'bg-amber-900/50 hover:bg-amber-900 text-amber-300' 
                : 'bg-white hover:bg-gray-100 text-slate-700 shadow-md'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          <WelcomeSection darkMode={darkMode} userName="Arjuna" />
          
          <div className="grid lg:grid-cols-2 gap-8">
            <TodaysVerse darkMode={darkMode} />
            <MoodCalendar darkMode={darkMode} />
          </div>

          <RecentChats darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}