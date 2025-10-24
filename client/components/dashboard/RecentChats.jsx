//Conversation history component for dashboard
'use client';
import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const RecentChats = ({ darkMode }) => {
  // Mock data - in production, fetch from database
  const recentChats = [
    {
      id: 1,
      title: 'Dealing with anxiety at work',
      timestamp: '2 hours ago',
      emotion: 'anxiety',
      preview: 'How can I find peace when work pressure...'
    },
    {
      id: 2,
      title: 'Finding my dharma',
      timestamp: 'Yesterday',
      emotion: 'curiosity',
      preview: 'What is my true purpose in life...'
    },
    {
      id: 3,
      title: 'Letting go of attachments',
      timestamp: '3 days ago',
      emotion: 'sadness',
      preview: 'I am struggling to detach from outcomes...'
    }
  ];

  return (
    <div className={`p-6 rounded-2xl border ${
      darkMode
        ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
        : 'bg-white border-amber-200 shadow-lg'
    }`}>
      <div className="flex items-center space-x-2 mb-6">
        <Clock className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
        <h3 className={`text-xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
          Recent Conversations
        </h3>
      </div>

      <div className="space-y-3">
        {recentChats.map(chat => (
          <Link key={chat.id} href={`/chat?id=${chat.id}`}>
            <div className={`p-4 rounded-lg transition-all cursor-pointer ${
              darkMode
                ? 'bg-slate-800/50 hover:bg-slate-800 border border-amber-900/20'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}>
              <div className="flex items-start space-x-3">
                <MessageCircle className={`w-5 h-5 mt-1 flex-shrink-0 ${
                  darkMode ? 'text-amber-400' : 'text-orange-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold mb-1 ${
                    darkMode ? 'text-amber-100' : 'text-slate-900'
                  }`}>
                    {chat.title}
                  </h4>
                  <p className={`text-sm mb-2 truncate ${
                    darkMode ? 'text-amber-300' : 'text-slate-600'
                  }`}>
                    {chat.preview}
                  </p>
                  <span className={`text-xs ${
                    darkMode ? 'text-amber-400' : 'text-slate-500'
                  }`}>
                    {chat.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/journey">
        <button className={`w-full mt-4 py-2 rounded-lg font-medium transition-all ${
          darkMode
            ? 'bg-amber-900/50 text-amber-200 hover:bg-amber-900'
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
        }`}>
          View All Conversations
        </button>
      </Link>
    </div>
  );
};

export default RecentChats;