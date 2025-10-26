'use client';
import React, { useState } from 'react';
import { Flame, BookOpen, MessageCircle, Award, TrendingUp, Star, Calendar, Target, Zap, Trophy, Heart, Brain, Sun, Moon, ChevronRight, Sparkles } from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';
const SpiritualProgressPage = () => {
  const [darkMode, setDarkMode] = useThemeMode(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock comprehensive data
  const progressData = {
    currentStreak: 21,
    longestStreak: 45,
    totalConversations: 127,
    versesExplored: 342,
    totalDays: 67,
    weeklyGoal: 10,
    currentWeekConversations: 8,
    monthlyGoal: 40,
    currentMonthConversations: 34,
    level: 7,
    xpCurrent: 2840,
    xpNextLevel: 3500,
    favoriteEmotion: 'Peace',
    mostActiveTime: 'Evening',
    averageSessionLength: '12 minutes',
    totalTimeSpent: '25 hours 34 minutes',
    wisdomScore: 87
  };

  const badges = [
    { id: 'first_conversation', icon: '🕉️', name: 'First Step', description: 'Started your journey', unlocked: true, date: 'Oct 1, 2025' },
    { id: 'week_streak', icon: '🔥', name: '7-Day Seeker', description: '7 consecutive days', unlocked: true, date: 'Oct 8, 2025' },
    { id: 'peace_seeker', icon: '🧘', name: 'Peace Seeker', description: 'Found inner peace 10 times', unlocked: true, date: 'Oct 15, 2025' },
    { id: 'verse_explorer', icon: '📖', name: 'Verse Explorer', description: 'Explored 100 verses', unlocked: true, date: 'Oct 20, 2025' },
    { id: 'karma_yogi', icon: '⚡', name: 'Karma Yogi', description: 'Applied 10 teachings', unlocked: true, date: 'Oct 25, 2025' },
    { id: 'month_warrior', icon: '🏆', name: '30-Day Warrior', description: '30-day streak', unlocked: false, date: null },
    { id: 'sage', icon: '👴', name: 'Sage', description: 'Explored 500 verses', unlocked: false, date: null },
    { id: 'enlightened', icon: '✨', name: 'Enlightened', description: '100-day streak', unlocked: false, date: null }
  ];

  const emotionDistribution = [
    { emotion: 'Peace', count: 45, percentage: 35, color: 'green', emoji: '😌' },
    { emotion: 'Anxiety', count: 32, percentage: 25, color: 'blue', emoji: '😰' },
    { emotion: 'Confusion', count: 20, percentage: 16, color: 'purple', emoji: '🤔' },
    { emotion: 'Joy', count: 18, percentage: 14, color: 'yellow', emoji: '😊' },
    { emotion: 'Sadness', count: 12, percentage: 10, color: 'indigo', emoji: '😢' }
  ];

  const weeklyActivity = [
    { day: 'Mon', conversations: 3, verses: 8 },
    { day: 'Tue', conversations: 2, verses: 5 },
    { day: 'Wed', conversations: 4, verses: 12 },
    { day: 'Thu', conversations: 1, verses: 3 },
    { day: 'Fri', conversations: 5, verses: 15 },
    { day: 'Sat', conversations: 3, verses: 9 },
    { day: 'Sun', conversations: 2, verses: 6 }
  ];

  const milestones = [
    { milestone: 'Level 7 Reached', description: 'Ascended to new wisdom tier', date: 'Oct 26, 2025', icon: '🎯' },
    { milestone: '300 Verses Explored', description: 'Deep dive into sacred texts', date: 'Oct 24, 2025', icon: '📚' },
    { milestone: '21-Day Streak', description: 'Remarkable consistency', date: 'Oct 21, 2025', icon: '🔥' },
    { milestone: '100 Conversations', description: 'Century of wisdom', date: 'Oct 18, 2025', icon: '💬' }
  ];

  const topVerses = [
    { chapter: 2, verse: 47, visits: 12, text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन' },
    { chapter: 2, verse: 48, visits: 10, text: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय' },
    { chapter: 4, verse: 7, visits: 9, text: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत' },
    { chapter: 6, verse: 5, visits: 8, text: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्' }
  ];

  const levelProgress = (progressData.xpCurrent / progressData.xpNextLevel) * 100;
  const weeklyProgress = (progressData.currentWeekConversations / progressData.weeklyGoal) * 100;
  const monthlyProgress = (progressData.currentMonthConversations / progressData.monthlyGoal) * 100;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'dark' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-md border-b sticky top-0 z-10 ${
        darkMode 
          ? 'bg-slate-900/80 border-amber-900/30' 
          : 'bg-white/80 border-amber-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
                  Spiritual Progress
                </h1>
                <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                  Your journey towards enlightenment
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-colors ${
                darkMode ? 'bg-amber-900/30 hover:bg-amber-900/50' : 'bg-orange-100 hover:bg-orange-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-orange-600" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Level & XP Card */}
        <div className={`p-8 rounded-3xl border-2 ${
          darkMode 
            ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/50'
            : 'bg-gradient-to-br from-white to-amber-50 border-amber-300 shadow-2xl'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
                Level {progressData.level} • Wisdom Seeker
              </h2>
              <p className={`text-lg ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                {progressData.xpCurrent.toLocaleString()} / {progressData.xpNextLevel.toLocaleString()} XP
              </p>
            </div>
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-amber-900/50' : 'bg-orange-100'}`}>
              <Sparkles className={`w-12 h-12 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
            </div>
          </div>
          
          <div className="mb-4">
            <div className={`h-4 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <div 
                className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-full transition-all duration-1000"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-white shadow'}`}>
              <p className={`text-sm mb-1 ${darkMode ? 'text-amber-400' : 'text-slate-600'}`}>Wisdom Score</p>
              <p className="text-3xl font-bold text-orange-600">{progressData.wisdomScore}</p>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-white shadow'}`}>
              <p className={`text-sm mb-1 ${darkMode ? 'text-amber-400' : 'text-slate-600'}`}>Total Days</p>
              <p className="text-3xl font-bold text-green-600">{progressData.totalDays}</p>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-white shadow'}`}>
              <p className={`text-sm mb-1 ${darkMode ? 'text-amber-400' : 'text-slate-600'}`}>Time Spent</p>
              <p className="text-xl font-bold text-blue-600">{progressData.totalTimeSpent}</p>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-white shadow'}`}>
              <p className={`text-sm mb-1 ${darkMode ? 'text-amber-400' : 'text-slate-600'}`}>Avg Session</p>
              <p className="text-xl font-bold text-purple-600">{progressData.averageSessionLength}</p>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Current Streak */}
          <div className={`p-6 rounded-2xl border ${
            darkMode 
              ? 'bg-gradient-to-br from-orange-900/30 to-slate-800/50 border-orange-700/50'
              : 'bg-gradient-to-br from-orange-50 to-white border-orange-300 shadow-xl'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-12 h-12 text-orange-500" />
              <div className="text-right">
                <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>Current Streak</p>
                <p className="text-4xl font-bold text-orange-600">{progressData.currentStreak}</p>
                <p className={`text-xs ${darkMode ? 'text-amber-400' : 'text-slate-500'}`}>days</p>
              </div>
            </div>
            <div className={`pt-4 border-t ${darkMode ? 'border-amber-700/30' : 'border-orange-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-slate-700'}`}>
                🏆 Longest: {progressData.longestStreak} days
              </p>
            </div>
          </div>

          {/* Conversations */}
          <div className={`p-6 rounded-2xl border ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-900/30 to-slate-800/50 border-blue-700/50'
              : 'bg-gradient-to-br from-blue-50 to-white border-blue-300 shadow-xl'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-12 h-12 text-blue-500" />
              <div className="text-right">
                <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>Conversations</p>
                <p className="text-4xl font-bold text-blue-600">{progressData.totalConversations}</p>
                <p className={`text-xs ${darkMode ? 'text-amber-400' : 'text-slate-500'}`}>total</p>
              </div>
            </div>
            <div className={`pt-4 border-t ${darkMode ? 'border-amber-700/30' : 'border-blue-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-slate-700'}`}>
                ⏰ Most Active: {progressData.mostActiveTime}
              </p>
            </div>
          </div>

          {/* Verses Explored */}
          <div className={`p-6 rounded-2xl border ${
            darkMode 
              ? 'bg-gradient-to-br from-purple-900/30 to-slate-800/50 border-purple-700/50'
              : 'bg-gradient-to-br from-purple-50 to-white border-purple-300 shadow-xl'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-12 h-12 text-purple-500" />
              <div className="text-right">
                <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>Verses Explored</p>
                <p className="text-4xl font-bold text-purple-600">{progressData.versesExplored}</p>
                <p className={`text-xs ${darkMode ? 'text-amber-400' : 'text-slate-500'}`}>shlokas</p>
              </div>
            </div>
            <div className={`pt-4 border-t ${darkMode ? 'border-amber-700/30' : 'border-purple-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-slate-700'}`}>
                ❤️ Top Emotion: {progressData.favoriteEmotion}
              </p>
            </div>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
              : 'bg-white border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <Target className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h3 className="text-xl font-bold">Weekly Goal</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={darkMode ? 'text-amber-200' : 'text-slate-700'}>
                  {progressData.currentWeekConversations} / {progressData.weeklyGoal} conversations
                </span>
                <span className="font-bold text-green-600">{Math.round(weeklyProgress)}%</span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
              <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                {progressData.weeklyGoal - progressData.currentWeekConversations} more to reach your goal!
              </p>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
              : 'bg-white border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h3 className="text-xl font-bold">Monthly Goal</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={darkMode ? 'text-amber-200' : 'text-slate-700'}>
                  {progressData.currentMonthConversations} / {progressData.monthlyGoal} conversations
                </span>
                <span className="font-bold text-blue-600">{Math.round(monthlyProgress)}%</span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${monthlyProgress}%` }}
                />
              </div>
              <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                {progressData.monthlyGoal - progressData.currentMonthConversations} more to reach your goal!
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className={`p-6 rounded-2xl border ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
            : 'bg-white border-amber-200 shadow-lg'
        }`}>
          <h3 className="text-xl font-bold mb-6">This Week's Activity</h3>
          <div className="grid grid-cols-7 gap-3">
            {weeklyActivity.map((day, idx) => (
              <div key={idx} className="text-center">
                <p className={`text-xs mb-3 font-semibold ${
                  darkMode ? 'text-amber-300' : 'text-slate-600'
                }`}>
                  {day.day}
                </p>
                <div className="space-y-2">
                  <div 
                    className={`rounded-lg transition-all hover:scale-105 ${
                      darkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                    }`}
                    style={{ height: `${Math.max(day.conversations * 20, 20)}px` }}
                    title={`${day.conversations} conversations`}
                  >
                    <div className="h-full flex items-end justify-center pb-1">
                      <span className="text-xs font-bold text-blue-600">{day.conversations}</span>
                    </div>
                  </div>
                  <div 
                    className={`rounded-lg transition-all hover:scale-105 ${
                      darkMode ? 'bg-purple-900/50' : 'bg-purple-100'
                    }`}
                    style={{ height: `${Math.max(day.verses * 8, 20)}px` }}
                    title={`${day.verses} verses`}
                  >
                    <div className="h-full flex items-end justify-center pb-1">
                      <span className="text-xs font-bold text-purple-600">{day.verses}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`} />
              <span className="text-sm">Conversations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`} />
              <span className="text-sm">Verses</span>
            </div>
          </div>
        </div>

        {/* Emotion Distribution */}
        <div className={`p-6 rounded-2xl border ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
            : 'bg-white border-amber-200 shadow-lg'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <Heart className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
            <h3 className="text-xl font-bold">Emotional Journey</h3>
          </div>
          <div className="space-y-4">
            {emotionDistribution.map((emotion, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{emotion.emoji}</span>
                    <span className="font-semibold">{emotion.emotion}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{emotion.count} times</span>
                    <span className="font-bold text-orange-600">{emotion.percentage}%</span>
                  </div>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full bg-${emotion.color}-500 rounded-full transition-all`}
                    style={{ width: `${emotion.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className={`p-6 rounded-2xl border ${
          darkMode 
            ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
            : 'bg-gradient-to-br from-orange-100 to-amber-100 border-amber-300 shadow-lg'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <Trophy className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
            <h3 className="text-xl font-bold">Achievements</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  badge.unlocked
                    ? darkMode
                      ? 'bg-amber-900/40 border-2 border-amber-600 hover:scale-105 hover:shadow-2xl'
                      : 'bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-400 hover:scale-105 hover:shadow-xl'
                    : 'opacity-40 grayscale'
                }`}
              >
                <div className="text-5xl mb-3">{badge.icon}</div>
                <p className="font-bold mb-1">{badge.name}</p>
                <p className={`text-xs mb-2 ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                  {badge.description}
                </p>
                {badge.unlocked && badge.date && (
                  <p className="text-xs text-orange-600 font-semibold">{badge.date}</p>
                )}
                {!badge.unlocked && (
                  <p className="text-xs text-gray-500">🔒 Locked</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Verses */}
        <div className={`p-6 rounded-2xl border ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
            : 'bg-white border-amber-200 shadow-lg'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <Star className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
            <h3 className="text-xl font-bold">Most Explored Verses</h3>
          </div>
          <div className="space-y-3">
            {topVerses.map((verse, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-l-4 border-orange-500 ${
                  darkMode ? 'bg-slate-800/50' : 'bg-orange-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-orange-600">
                    Chapter {verse.chapter}, Verse {verse.verse}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    darkMode ? 'bg-amber-900/50 text-amber-200' : 'bg-orange-200 text-orange-800'
                  }`}>
                    {verse.visits} visits
                  </span>
                </div>
                <p className={`font-serif text-lg ${darkMode ? 'text-amber-200' : 'text-slate-800'}`}>
                  {verse.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className={`p-6 rounded-2xl border ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
            : 'bg-white border-amber-200 shadow-lg'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <Zap className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
            <h3 className="text-xl font-bold">Recent Milestones</h3>
          </div>
          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-amber-900/30' : 'bg-orange-100'}`}>
                  <span className="text-2xl">{milestone.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold mb-1">{milestone.milestone}</p>
                  <p className={`text-sm mb-1 ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    {milestone.description}
                  </p>
                  <p className="text-xs text-orange-600 font-semibold">{milestone.date}</p>
                </div>
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-slate-400'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualProgressPage;