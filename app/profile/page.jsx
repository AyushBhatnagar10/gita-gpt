'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, BookOpen, MessageCircle, Award, Calendar, Heart } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import { useAuth } from '@/components/shared/AuthContext';

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useAuth();

  const [profile, setProfile] = useState({
    firstName: userData?.firstName || 'Arjuna',
    lastName: userData?.lastName || 'Pandava',
    email: userData?.email || 'arjuna@gitagpt.com',
    phone: userData?.phone || '+91 9876543210',
    city: userData?.city || 'Ahmedabad',
    state: userData?.state || 'Gujarat',
    country: userData?.country || 'India',
    bio: 'Seeking wisdom and inner peace through the teachings of the Bhagavad Gita.'
  });

  const stats = {
    totalConversations: 47,
    versesExplored: 123,
    favoriteVerses: 8,
    streakDays: 15,
    joinedDate: 'October 2024',
    topEmotion: 'Peace'
  };

  const favoriteVerses = [
    { chapter: 2, verse: 47, text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन' },
    { chapter: 2, verse: 48, text: 'योगस्थः कुरु कर्माणि' },
    { chapter: 4, verse: 7, text: 'यदा यदा हि धर्मस्य' }
  ];

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Save to backend
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-amber-50' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800'
    }`}>
      <Sidebar darkMode={darkMode} />

      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className={`text-4xl font-bold mb-8 ${
            darkMode ? 'text-amber-100' : 'text-slate-900'
          }`}>
            My Profile
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-2xl border ${
                darkMode 
                  ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
                  : 'bg-white border-amber-200 shadow-lg'
              }`}>
                <div className="text-center mb-6">
                  <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-bold ${
                    darkMode 
                      ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white'
                      : 'bg-gradient-to-br from-orange-400 to-amber-400 text-white'
                  }`}>
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                  <h2 className="text-2xl font-bold mb-1">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    Member since {stats.joinedDate}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className={`space-y-3 p-4 rounded-lg ${
                  darkMode ? 'bg-slate-800/50' : 'bg-orange-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Conversations</span>
                    </div>
                    <span className="font-bold">{stats.totalConversations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Verses Explored</span>
                    </div>
                    <span className="font-bold">{stats.versesExplored}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Favorite Verses</span>
                    </div>
                    <span className="font-bold">{stats.favoriteVerses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Current Streak</span>
                    </div>
                    <span className="font-bold">{stats.streakDays} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-sm">Top Emotion</span>
                    </div>
                    <span className="font-bold">{stats.topEmotion}</span>
                  </div>
                </div>

                <button
                  onClick={handleEdit}
                  className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                    darkMode
                      ? 'bg-amber-900/50 text-amber-200 hover:bg-amber-900'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className={`p-6 rounded-2xl border ${
                darkMode 
                  ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
                  : 'bg-white border-amber-200 shadow-lg'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Personal Information</h3>
                  {isEditing && (
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-xl transition-all flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-800 border-amber-700 text-amber-100' 
                            : 'bg-white border-gray-300 text-slate-900'
                        } ${!isEditing && 'opacity-75'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-800 border-amber-700 text-amber-100' 
                            : 'bg-white border-gray-300 text-slate-900'
                        } ${!isEditing && 'opacity-75'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-800 border-amber-700 text-amber-100' 
                            : 'bg-white border-gray-300 text-slate-900'
                        } ${!isEditing && 'opacity-75'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-800 border-amber-700 text-amber-100' 
                            : 'bg-white border-gray-300 text-slate-900'
                        } ${!isEditing && 'opacity-75'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-800 border-amber-700 text-amber-100' 
                            : 'bg-white border-gray-300 text-slate-900'
                        } ${!isEditing && 'opacity-75'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="state"
                        value={profile.state}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-800 border-amber-700 text-amber-100' 
                            : 'bg-white border-gray-300 text-slate-900'
                        } ${!isEditing && 'opacity-75'}`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-800 border-amber-700 text-amber-100' 
                            : 'bg-white border-gray-300 text-slate-900'
                        } ${!isEditing && 'opacity-75'}`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-800 border-amber-700 text-amber-100' 
                          : 'bg-white border-gray-300 text-slate-900'
                      } ${!isEditing && 'opacity-75'}`}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Favorite Verses */}
              <div className={`p-6 rounded-2xl border ${
                darkMode 
                  ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
                  : 'bg-white border-amber-200 shadow-lg'
              }`}>
                <div className="flex items-center space-x-2 mb-6">
                  <Heart className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
                  <h3 className="text-2xl font-bold">Favorite Verses</h3>
                </div>

                <div className="space-y-4">
                  {favoriteVerses.map((verse, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-800/50 border-amber-900/20'
                          : 'bg-orange-50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-orange-600 font-semibold mb-2">
                            Chapter {verse.chapter}, Verse {verse.verse}
                          </p>
                          <p className={`text-lg font-serif ${
                            darkMode ? 'text-amber-200' : 'text-slate-800'
                          }`}>
                            {verse.text}
                          </p>
                        </div>
                        <button className={`p-2 rounded-lg transition-colors ${
                          darkMode ? 'hover:bg-slate-700' : 'hover:bg-orange-100'
                        }`}>
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={`w-full mt-4 py-2 rounded-lg font-medium transition-all ${
                  darkMode
                    ? 'bg-amber-900/50 text-amber-200 hover:bg-amber-900'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}>
                  View All Favorites
                </button>
              </div>

              {/* Spiritual Journey Summary */}
              <div className={`p-6 rounded-2xl border ${
                darkMode 
                  ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
                  : 'bg-gradient-to-br from-orange-100 to-amber-100 border-amber-300 shadow-lg'
              }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <Award className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
                  <h3 className="text-2xl font-bold">Your Spiritual Journey</h3>
                </div>
                <p className={`text-lg ${darkMode ? 'text-amber-200' : 'text-slate-700'}`}>
                  You've been on a beautiful path of self-discovery for the past {stats.streakDays} days. 
                  Your dedication to seeking wisdom through {stats.totalConversations} conversations and 
                  exploring {stats.versesExplored} verses shows your commitment to growth. Keep going! 🕉️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}