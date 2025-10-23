//daily shlokas from bhagavad gita component
'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';

const TodaysVerse = ({ darkMode }) => {
  const verses = [
    {
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
      transliteration: "Karmanye vadhikaraste Ma Phaleshu Kadachana",
      meaning: "You have the right to perform your duty, but not to the fruits of your actions",
      chapter: "Chapter 2, Verse 47"
    },
    {
      sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय",
      transliteration: "Yogasthah kuru karmani sangam tyaktva dhananjaya",
      meaning: "Perform your duty with equipoise, abandoning all attachment to success or failure",
      chapter: "Chapter 2, Verse 48"
    },
    {
      sanskrit: "समदुःखसुखः स्वस्थः समलोष्टाश्मकाञ्चनः",
      transliteration: "Sama-duhkha-sukhah svastah sama-loshtashma-kanchanah",
      meaning: "One who is equal in pain and pleasure, steady and balanced, treating gold and stone alike",
      chapter: "Chapter 14, Verse 24"
    }
  ];

  const [currentVerse, setCurrentVerse] = useState(verses[0]);

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    setCurrentVerse(verses[dayOfYear % verses.length]);
  }, []);

  const refreshVerse = () => {
    const randomIndex = Math.floor(Math.random() * verses.length);
    setCurrentVerse(verses[randomIndex]);
  };

  return (
    <div className={`p-6 rounded-2xl border ${
      darkMode
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
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-slate-700' : 'hover:bg-orange-100'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-amber-300' : 'text-orange-600'}`} />
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-orange-600 font-semibold">{currentVerse.chapter}</p>
        <p className={`text-2xl font-serif ${darkMode ? 'text-amber-200' : 'text-orange-800'}`}>
          {currentVerse.sanskrit}
        </p>
        <p className={`text-sm italic ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
          {currentVerse.transliteration}
        </p>
        <p className={`text-base ${darkMode ? 'text-amber-100' : 'text-slate-700'}`}>
          "{currentVerse.meaning}"
        </p>
      </div>
    </div>
  );
};

export default TodaysVerse;