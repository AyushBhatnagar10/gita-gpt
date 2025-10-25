'use client';
import React, { useState } from 'react';
import { Flame, BookOpen, MessageCircle, Award, TrendingUp, Star } from 'lucide-react';

const SpiritualProgress = ({ darkMode }) => {
  // Mock data - will come from backend later
  const userData = {
    conversationStreak: 7,
    totalConversations: 23,
    versesExplored: 45,
    weeklyGoal: 10,
    currentWeekConversations: 6,
    favoriteEmotion: 'Peace',
    badges: ['first_conversation', 'week_streak', 'peace_seeker']
  };

  const badges = [
    { id: 'first_conversation', icon: '🕉️', name: 'First Step', description: 'Started your journey', unlocked: true },
    { id: 'week_streak', icon: '🔥', name: '7-Day Seeker', description: '7 consecutive days', unlocked: true },
    { id: 'peace_seeker', icon: '🧘', name: 'Peace Seeker', description: 'Found inner peace', unlocked: true },
    { id: 'verse_explorer', icon: '📖', name: 'Verse Explorer', description: 'Explored 50 verses', unlocked: false },
    { id: 'karma_yogi', icon: '⚡', name: 'Karma Yogi', description: 'Applied 10 teachings', unlocked: false },
    { id: 'month_warrior', icon: '🏆', name: 'Arjuna\'s Spirit', description: '30-day streak', unlocked: false }
  ];

  // Calculate progress percentages
  const weeklyProgress = (userData.currentWeekConversations / userData.weeklyGoal) * 100;
  const verseProgress = (userData.versesExplored / 100) * 100; // Goal: 100 verses

  return (
    <div className={`p-6 rounded-2xl border ${
      darkMode
        ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
        : 'bg-white border-amber-200 shadow-lg'
    }`}>
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
        <h3 className={`text-xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
          Spiritual Progress
        </h3>
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Conversation Streak */}
        <div className="text-center">
          <div className={`relative w-24 h-24 mx-auto mb-2 ${
            darkMode ? 'bg-slate-800/50' : 'bg-orange-50'
          } rounded-full flex items-center justify-center`}>
            <div className={`absolute inset-0 rounded-full border-4 ${
              darkMode ? 'border-amber-900/30' : 'border-orange-200'
            }`}></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent transition-all duration-500"
              style={{ 
                transform: `rotate(${(userData.conversationStreak / 30) * 360}deg)`,
                borderTopColor: 'transparent'
              }}
            ></div>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
            {userData.conversationStreak}
          </p>
          <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            Day Streak
          </p>
        </div>

        {/* Weekly Progress */}
        <div className="text-center">
          <div className={`relative w-24 h-24 mx-auto mb-2 ${
            darkMode ? 'bg-slate-800/50' : 'bg-green-50'
          } rounded-full flex items-center justify-center`}>
            <div className={`absolute inset-0 rounded-full border-4 ${
              darkMode ? 'border-amber-900/30' : 'border-green-200'
            }`}></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent transition-all duration-500"
              style={{ 
                transform: `rotate(${(weeklyProgress / 100) * 360}deg)`,
                borderTopColor: 'transparent'
              }}
            ></div>
            <MessageCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
            {userData.currentWeekConversations}/{userData.weeklyGoal}
          </p>
          <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            This Week
          </p>
        </div>

        {/* Verses Explored */}
        <div className="text-center">
          <div className={`relative w-24 h-24 mx-auto mb-2 ${
            darkMode ? 'bg-slate-800/50' : 'bg-blue-50'
          } rounded-full flex items-center justify-center`}>
            <div className={`absolute inset-0 rounded-full border-4 ${
              darkMode ? 'border-amber-900/30' : 'border-blue-200'
            }`}></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent transition-all duration-500"
              style={{ 
                transform: `rotate(${(verseProgress / 100) * 360}deg)`,
                borderTopColor: 'transparent'
              }}
            ></div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
            {userData.versesExplored}
          </p>
          <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            Verses Explored
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-3 gap-3 mb-6 p-4 rounded-lg ${
        darkMode ? 'bg-slate-800/30' : 'bg-orange-50'
      }`}>
        <div className="text-center">
          <p className={`text-lg font-bold ${darkMode ? 'text-amber-200' : 'text-orange-600'}`}>
            {userData.totalConversations}
          </p>
          <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            Total Chats
          </p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${darkMode ? 'text-amber-200' : 'text-orange-600'}`}>
            {userData.favoriteEmotion}
          </p>
          <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            Top Emotion
          </p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${darkMode ? 'text-amber-200' : 'text-orange-600'}`}>
            Seeker
          </p>
          <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            Your Path
          </p>
        </div>
      </div>

      {/* Achievement Badges */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Award className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
          <h4 className={`font-semibold ${darkMode ? 'text-amber-200' : 'text-slate-800'}`}>
            Achievements
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-3 rounded-lg text-center transition-all ${
                badge.unlocked
                  ? darkMode
                    ? 'bg-amber-900/30 border border-amber-700/50'
                    : 'bg-gradient-to-br from-orange-100 to-amber-100 border border-amber-300'
                  : darkMode
                    ? 'bg-slate-800/30 opacity-40'
                    : 'bg-gray-100 opacity-40'
              }`}
              title={badge.description}
            >
              <div className="text-3xl mb-1">{badge.icon}</div>
              <p className={`text-xs font-medium ${
                badge.unlocked
                  ? darkMode ? 'text-amber-200' : 'text-slate-700'
                  : 'text-gray-500'
              }`}>
                {badge.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Inspirational Quote */}
      <div className={`mt-6 p-4 rounded-lg border-l-4 ${
        darkMode
          ? 'bg-slate-800/30 border-amber-500'
          : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-500'
      }`}>
        <p className={`text-sm italic ${darkMode ? 'text-amber-200' : 'text-slate-700'}`}>
          "You are making excellent progress on your spiritual journey. Keep seeking wisdom daily!"
        </p>
      </div>
    </div>
  );
};

export default SpiritualProgress;