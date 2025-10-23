//monthly mood calender component
'use client';
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MoodCalendar = ({ darkMode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const emotions = {
    joy: { color: 'bg-yellow-400', label: 'Joy' },
    peace: { color: 'bg-green-400', label: 'Peace' },
    anxiety: { color: 'bg-blue-400', label: 'Anxiety' },
    sadness: { color: 'bg-blue-600', label: 'Sadness' },
    anger: { color: 'bg-red-500', label: 'Anger' },
    neutral: { color: 'bg-gray-400', label: 'Neutral' }
  };

  // Mock data - in production, fetch from database
  const moodData = {
    1: 'peace', 2: 'joy', 5: 'anxiety', 8: 'peace',
    10: 'joy', 12: 'neutral', 15: 'peace', 18: 'sadness',
    20: 'joy', 22: 'peace', 25: 'anxiety'
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className={`p-6 rounded-2xl border ${
      darkMode
        ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
        : 'bg-white border-amber-200 shadow-lg'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
          <h3 className={`text-xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
            Mood Tracker
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={prevMonth} className={`p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold min-w-[140px] text-center">{monthName}</span>
          <button onClick={nextMonth} className={`p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`text-center text-xs font-semibold py-2 ${
            darkMode ? 'text-amber-300' : 'text-slate-600'
          }`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const mood = moodData[day];
          const isToday = day === new Date().getDate() && 
                         currentMonth.getMonth() === new Date().getMonth();

          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isToday ? 'ring-2 ring-orange-500' : ''
              } ${
                mood 
                  ? `${emotions[mood].color} text-white hover:scale-110` 
                  : darkMode 
                    ? 'bg-slate-700/50 text-amber-200 hover:bg-slate-700' 
                    : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
              title={mood ? emotions[mood].label : 'No data'}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(emotions).map(([key, { color, label }]) => (
          <div key={key} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className={`text-xs ${darkMode ? 'text-amber-200' : 'text-slate-600'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodCalendar;