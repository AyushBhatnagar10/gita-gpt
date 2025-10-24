'use client';
import React, { useState, useEffect } from 'react';
import { Sun, Moon, MessageCircle, BarChart3, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import TodaysVerse from '@/components/dashboard/TodaysVerse';
import MoodCalendar from '@/components/dashboard/MoodCalendar';
import RecentChats from '@/components/dashboard/RecentChats';
import ChatInterface from '@/components/dashboard/ChatInterface';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const { currentUser, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900">
        <div className="text-amber-100 text-xl">Loading...</div>
      </div>
    );
  }

  const userName = userData?.firstName || currentUser?.displayName?.split(' ')[0] || 'Seeker';

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'calendar', label: 'Mood Calendar', icon: Calendar },
  ];

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-amber-50' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800'
    }`}>
      <Sidebar darkMode={darkMode} />
      
      <div className="ml-64 flex flex-col h-screen">
        {/* Header */}
        <div className="p-6 border-b border-amber-200/20">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-bold ${
              darkMode ? 'text-amber-100' : 'text-slate-800'
            }`}>
              Welcome back, {userName}
            </h1>
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

          {/* Tab Navigation */}
          <div className="flex gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-md'
                      : darkMode
                      ? 'bg-slate-800/50 text-amber-200 hover:bg-slate-700'
                      : 'bg-white/50 text-slate-700 hover:bg-white shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && (
            <ChatInterface darkMode={darkMode} />
          )}
          
          {activeTab === 'overview' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-7xl mx-auto space-y-8">
                <WelcomeSection darkMode={darkMode} userName={userName} />
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <TodaysVerse darkMode={darkMode} />
                  <div className="h-96">
                    <MoodCalendar darkMode={darkMode} />
                  </div>
                </div>

                <RecentChats darkMode={darkMode} />
              </div>
            </div>
          )}
          
          {activeTab === 'calendar' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-4xl mx-auto">
                <MoodCalendar darkMode={darkMode} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}