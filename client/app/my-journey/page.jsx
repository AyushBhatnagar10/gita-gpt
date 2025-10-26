'use client';
import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, Heart, Search, Filter, ChevronDown, MessageCircle, Smile, TrendingUp, Download, Share2, Trash2, Star, Eye, Sun, Moon } from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';

const MyJourneyPage = () => {
  const [darkMode, setDarkMode] = useThemeMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Mock conversation data
  const conversations = [
    {
      id: 1,
      title: "Finding peace in chaos",
      date: "Oct 26, 2025",
      time: "6:30 PM",
      duration: "15 min",
      messageCount: 12,
      emotion: { label: "Anxiety", emoji: "😰", color: "blue" },
      mode: "wisdom",
      preview: "How do I find inner peace when everything around me feels chaotic?",
      verses: [
        { chapter: 2, verse: 47, text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" },
        { chapter: 6, verse: 5, text: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्" }
      ],
      favorite: true,
      tags: ["peace", "anxiety", "work"]
    },
    {
      id: 2,
      title: "Understanding my life purpose",
      date: "Oct 25, 2025",
      time: "8:15 AM",
      duration: "22 min",
      messageCount: 18,
      emotion: { label: "Confusion", emoji: "🤔", color: "purple" },
      mode: "socratic",
      preview: "What is my dharma? How do I know I'm on the right path?",
      verses: [
        { chapter: 3, verse: 35, text: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्" }
      ],
      favorite: false,
      tags: ["dharma", "purpose", "career"]
    },
    {
      id: 3,
      title: "Letting go of attachments",
      date: "Oct 24, 2025",
      time: "9:45 PM",
      duration: "18 min",
      messageCount: 14,
      emotion: { label: "Sadness", emoji: "😢", color: "indigo" },
      mode: "story",
      preview: "I'm struggling to let go of someone I love. How do I detach without losing compassion?",
      verses: [
        { chapter: 2, verse: 48, text: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय" }
      ],
      favorite: true,
      tags: ["attachment", "relationships", "love"]
    },
    {
      id: 4,
      title: "Dealing with workplace conflict",
      date: "Oct 23, 2025",
      time: "1:20 PM",
      duration: "12 min",
      messageCount: 10,
      emotion: { label: "Anger", emoji: "😠", color: "red" },
      mode: "wisdom",
      preview: "My colleague took credit for my work. I feel so angry and betrayed.",
      verses: [
        { chapter: 16, verse: 21, text: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः" }
      ],
      favorite: false,
      tags: ["anger", "work", "justice"]
    },
    {
      id: 5,
      title: "Celebrating small victories",
      date: "Oct 22, 2025",
      time: "7:00 PM",
      duration: "8 min",
      messageCount: 6,
      emotion: { label: "Joy", emoji: "😊", color: "yellow" },
      mode: "wisdom",
      preview: "I achieved a goal today! How do I stay grateful without becoming complacent?",
      verses: [
        { chapter: 2, verse: 47, text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" }
      ],
      favorite: false,
      tags: ["gratitude", "success", "happiness"]
    },
    {
      id: 6,
      title: "Fear of failure",
      date: "Oct 21, 2025",
      time: "11:30 PM",
      duration: "20 min",
      messageCount: 16,
      emotion: { label: "Anxiety", emoji: "😰", color: "blue" },
      mode: "socratic",
      preview: "I have an important presentation tomorrow and I'm terrified of failing.",
      verses: [
        { chapter: 11, verse: 33, text: "निमित्तमात्रं भव सव्यसाचिन्" }
      ],
      favorite: true,
      tags: ["fear", "performance", "anxiety"]
    },
    {
      id: 7,
      title: "Morning meditation insights",
      date: "Oct 20, 2025",
      time: "6:00 AM",
      duration: "10 min",
      messageCount: 8,
      emotion: { label: "Peace", emoji: "😌", color: "green" },
      mode: "wisdom",
      preview: "During meditation, I felt a deep sense of connection. What does this mean?",
      verses: [
        { chapter: 6, verse: 47, text: "योगिनामपि सर्वेषां मद्गतेनान्तरात्मना" }
      ],
      favorite: false,
      tags: ["meditation", "peace", "spirituality"]
    },
    {
      id: 8,
      title: "Handling criticism",
      date: "Oct 19, 2025",
      time: "3:45 PM",
      duration: "14 min",
      messageCount: 11,
      emotion: { label: "Sadness", emoji: "😢", color: "indigo" },
      mode: "story",
      preview: "Someone criticized my work harshly. How do I not take it personally?",
      verses: [
        { chapter: 2, verse: 57, text: "यः सर्वत्रानभिस्नेहस्तत्तत्प्राप्य शुभाशुभम्" }
      ],
      favorite: false,
      tags: ["criticism", "ego", "work"]
    }
  ];

  const stats = {
    totalConversations: conversations.length,
    totalMessages: conversations.reduce((sum, c) => sum + c.messageCount, 0),
    totalTime: "2h 37min",
    favoriteCount: conversations.filter(c => c.favorite).length,
    mostFrequentEmotion: "Anxiety"
  };

  const emotions = [
    { value: 'all', label: 'All Emotions', emoji: '🌟' },
    { value: 'peace', label: 'Peace', emoji: '😌' },
    { value: 'anxiety', label: 'Anxiety', emoji: '😰' },
    { value: 'joy', label: 'Joy', emoji: '😊' },
    { value: 'sadness', label: 'Sadness', emoji: '😢' },
    { value: 'anger', label: 'Anger', emoji: '😠' },
    { value: 'confusion', label: 'Confusion', emoji: '🤔' }
  ];

  const modes = [
    { value: 'all', label: 'All Modes', icon: '🌐' },
    { value: 'wisdom', label: 'Wisdom', icon: '📖' },
    { value: 'socratic', label: 'Socratic', icon: '🧠' },
    { value: 'story', label: 'Story', icon: '💬' }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchQuery === '' || 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesEmotion = filterEmotion === 'all' || 
      conv.emotion.label.toLowerCase() === filterEmotion.toLowerCase();
    
    const matchesMode = filterMode === 'all' || conv.mode === filterMode;
    
    return matchesSearch && matchesEmotion && matchesMode;
  });

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
              <BookOpen className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-amber-100' : 'text-slate-900'}`}>
                  My Journey
                </h1>
                <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                  Your spiritual conversation history
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className={`p-4 rounded-xl text-center ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border border-amber-700/20'
              : 'bg-white border border-amber-200 shadow-lg'
          }`}>
            <MessageCircle className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
            <p className="text-2xl font-bold text-orange-600">{stats.totalConversations}</p>
            <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>Conversations</p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border border-amber-700/20'
              : 'bg-white border border-amber-200 shadow-lg'
          }`}>
            <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-amber-400' : 'text-blue-600'}`} />
            <p className="text-2xl font-bold text-blue-600">{stats.totalMessages}</p>
            <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>Messages</p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border border-amber-700/20'
              : 'bg-white border border-amber-200 shadow-lg'
          }`}>
            <Clock className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-amber-400' : 'text-purple-600'}`} />
            <p className="text-2xl font-bold text-purple-600">{stats.totalTime}</p>
            <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>Total Time</p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border border-amber-700/20'
              : 'bg-white border border-amber-200 shadow-lg'
          }`}>
            <Star className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-amber-400' : 'text-yellow-500'}`} />
            <p className="text-2xl font-bold text-yellow-600">{stats.favoriteCount}</p>
            <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>Favorites</p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border border-amber-700/20'
              : 'bg-white border border-amber-200 shadow-lg'
          }`}>
            <Heart className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-amber-400' : 'text-red-500'}`} />
            <p className="text-lg font-bold text-red-600">{stats.mostFrequentEmotion}</p>
            <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>Top Emotion</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={`p-6 rounded-2xl border mb-8 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
            : 'bg-white border-amber-200 shadow-lg'
        }`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-3.5 w-5 h-5 ${
                darkMode ? 'text-amber-400' : 'text-slate-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations, tags, or topics..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  darkMode
                    ? 'bg-slate-800 border-amber-700 text-amber-100 placeholder-amber-400/50'
                    : 'bg-white border-gray-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                showFilters
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                  : darkMode
                  ? 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-amber-700/20">
              <div>
                <label className="block text-sm font-semibold mb-3">Filter by Emotion</label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map(emotion => (
                    <button
                      key={emotion.value}
                      onClick={() => setFilterEmotion(emotion.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterEmotion === emotion.value
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-105'
                          : darkMode
                          ? 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                          : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                      }`}
                    >
                      {emotion.emoji} {emotion.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">Filter by Mode</label>
                <div className="flex flex-wrap gap-2">
                  {modes.map(mode => (
                    <button
                      key={mode.value}
                      onClick={() => setFilterMode(mode.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterMode === mode.value
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-105'
                          : darkMode
                          ? 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                          : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                      }`}
                    >
                      {mode.icon} {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
            Showing {filteredConversations.length} of {conversations.length} conversations
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <div className={`p-12 rounded-2xl border text-center ${
              darkMode 
                ? 'bg-slate-800/50 border-amber-700/20'
                : 'bg-white border-amber-200'
            }`}>
              <Search className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? 'text-amber-400' : 'text-slate-400'
              }`} />
              <h3 className="text-xl font-bold mb-2">No conversations found</h3>
              <p className={darkMode ? 'text-amber-300' : 'text-slate-600'}>
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${
                  darkMode 
                    ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20 hover:border-amber-600'
                    : 'bg-white border-amber-200 shadow-lg hover:shadow-xl hover:border-orange-400'
                }`}
                onClick={() => setSelectedConversation(conv.id === selectedConversation ? null : conv.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold">{conv.title}</h3>
                      {conv.favorite && (
                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span>{conv.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{conv.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                        <span>{conv.messageCount} messages</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span>{conv.duration}</span>
                      </div>
                    </div>

                    <p className={`mb-3 ${darkMode ? 'text-amber-200' : 'text-slate-700'}`}>
                      {conv.preview}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                        darkMode ? 'bg-slate-700' : 'bg-gray-100'
                      }`}>
                        <span className="text-lg">{conv.emotion.emoji}</span>
                        <span>{conv.emotion.label}</span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                        darkMode ? 'bg-amber-900/30 text-amber-200' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {conv.mode} mode
                      </span>
                      {conv.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-sm ${
                            darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-slate-700 text-amber-300' : 'hover:bg-orange-100 text-slate-600'
                    }`} title="View conversation">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-slate-700 text-amber-300' : 'hover:bg-orange-100 text-slate-600'
                    }`} title="Download">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-slate-700 text-amber-300' : 'hover:bg-orange-100 text-slate-600'
                    }`} title="Share">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-slate-700 text-red-400' : 'hover:bg-red-100 text-red-600'
                    }`} title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded View */}
                {selectedConversation === conv.id && (
                  <div className={`pt-4 mt-4 border-t ${
                    darkMode ? 'border-amber-700/30' : 'border-amber-200'
                  }`}>
                    <h4 className="font-semibold mb-3">Verses Explored:</h4>
                    <div className="space-y-3">
                      {conv.verses.map((verse, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border-l-4 border-orange-500 ${
                            darkMode ? 'bg-slate-800/50' : 'bg-orange-50'
                          }`}
                        >
                          <p className="text-sm font-bold text-orange-600 mb-2">
                            📖 Chapter {verse.chapter}, Verse {verse.verse}
                          </p>
                          <p className={`font-serif text-lg ${
                            darkMode ? 'text-amber-200' : 'text-slate-800'
                          }`}>
                            {verse.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJourneyPage;