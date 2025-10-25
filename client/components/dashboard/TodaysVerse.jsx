//daily shlokas from bhagavad gita component
'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { getRandomVerse } from '@/lib/api';

const TodaysVerse = ({ darkMode }) => {
  const [currentVerse, setCurrentVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback verses in case API fails
  const fallbackVerses = [
    {
      shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
      transliteration: "Karmanye vadhikaraste Ma Phaleshu Kadachana",
      eng_meaning: "You have the right to perform your duty, but not to the fruits of your actions",
      chapter: 2,
      verse: 47
    },
    {
      shloka: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय",
      transliteration: "Yogasthah kuru karmani sangam tyaktva dhananjaya",
      eng_meaning: "Perform your duty with equipoise, abandoning all attachment to success or failure",
      chapter: 2,
      verse: 48
    },
    {
      shloka: "समदुःखसुखः स्वस्थः समलोष्टाश्मकाञ्चनः",
      transliteration: "Sama-duhkha-sukhah svastah sama-loshtashma-kanchanah",
      eng_meaning: "One who is equal in pain and pleasure, steady and balanced, treating gold and stone alike",
      chapter: 14,
      verse: 24
    }
  ];

  const fetchRandomVerse = async () => {
    try {
      setLoading(true);
      setError(null);

      const verseData = await getRandomVerse();
      setCurrentVerse(verseData);
    } catch (err) {
      console.error('Error fetching verse:', err);
      setError(err.message);

      // Use fallback verse
      const randomIndex = Math.floor(Math.random() * fallbackVerses.length);
      setCurrentVerse(fallbackVerses[randomIndex]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial verse (daily verse based on date)
    const loadDailyVerse = async () => {
      try {
        setLoading(true);

        // Try to get from API first
        const verseData = await getRandomVerse();
        setCurrentVerse(verseData);
      } catch (err) {
        console.error('Error loading daily verse:', err);

        // Fallback to date-based selection from local verses
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        setCurrentVerse(fallbackVerses[dayOfYear % fallbackVerses.length]);
      } finally {
        setLoading(false);
      }
    };

    loadDailyVerse();
  }, []);

  const refreshVerse = () => {
    fetchRandomVerse();
  };

  if (loading) {
    return (
      <div className={`p-6 rounded-2xl border ${darkMode
        ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
        : 'bg-gradient-to-br from-white to-orange-50 border-amber-200 shadow-lg'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
            <h3 className={`text-xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
              Today's Verse
            </h3>
          </div>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className={`h-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
          <div className={`h-8 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
          <div className={`h-6 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    );
  }

  if (!currentVerse) {
    return (
      <div className={`p-6 rounded-2xl border ${darkMode
        ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
        : 'bg-gradient-to-br from-white to-orange-50 border-amber-200 shadow-lg'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
            <h3 className={`text-xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
              Today's Verse
            </h3>
          </div>
          <button
            onClick={refreshVerse}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-orange-100'
              }`}
          >
            <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-amber-300' : 'text-orange-600'}`} />
          </button>
        </div>
        <div className="text-center py-8">
          <p className={`${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            Unable to load verse. Please try refreshing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl border ${darkMode
      ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
      : 'bg-gradient-to-br from-white to-orange-50 border-amber-200 shadow-lg'
      }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
          <h3 className={`text-xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
            Today's Verse
          </h3>
        </div>
        <button
          onClick={refreshVerse}
          disabled={loading}
          className={`p-2 rounded-lg transition-colors ${loading
            ? 'opacity-50 cursor-not-allowed'
            : darkMode ? 'hover:bg-slate-700' : 'hover:bg-orange-100'
            }`}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''
            } ${darkMode ? 'text-amber-300' : 'text-orange-600'}`} />
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-orange-600 font-semibold">
          Chapter {currentVerse.chapter}, Verse {currentVerse.verse}
        </p>
        <p className={`text-2xl font-serif ${darkMode ? 'text-amber-200' : 'text-orange-800'}`}>
          {currentVerse.shloka}
        </p>
        {currentVerse.transliteration && (
          <p className={`text-sm italic ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            {currentVerse.transliteration}
          </p>
        )}
        <p className={`text-base ${darkMode ? 'text-amber-100' : 'text-slate-700'}`}>
          "{currentVerse.eng_meaning}"
        </p>
        {error && (
          <p className="text-xs text-orange-500 mt-2">
            Note: Using offline verse due to connection issue
          </p>
        )}
      </div>
    </div>
  );
};

export default TodaysVerse;