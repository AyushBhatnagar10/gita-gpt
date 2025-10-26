'use client';
import React, { useState } from 'react';
import { Bell, Lock, Palette, Globe, Download, Trash2, Shield, Moon, Sun } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import { useThemeMode } from '@/hooks/useThemeMode';

export default function Settings() {
  const [darkMode, setDarkMode] = useThemeMode();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    verseReminders: true,
    soundEffects: true,
    language: 'english',
    defaultMode: 'wisdom',
    autoSave: true,
    dataSharing: false
  });

  const handleToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleSelect = (setting, value) => {
    setSettings({ ...settings, [setting]: value });
  };

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode 
        ? 'dark' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800'
    }`}>
      <Sidebar darkMode={darkMode} />

      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl font-bold mb-8 ${
            darkMode ? 'text-amber-100' : 'text-slate-900'
          }`}>
            Settings
          </h1>

          {/* Appearance */}
          <div className={`p-6 rounded-2xl border mb-6 ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
              : 'bg-white border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-2 mb-6">
              <Palette className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h2 className="text-2xl font-bold">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Dark Mode</p>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    Enable dark theme for better night viewing
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    darkMode ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform flex items-center justify-center ${
                    darkMode ? 'transform translate-x-7' : ''
                  }`}>
                    {darkMode ? <Moon className="w-3 h-3 text-orange-500" /> : <Sun className="w-3 h-3 text-gray-400" />}
                  </div>
                </button>
              </div>

              <div>
                <p className="font-semibold mb-3">Language Preference</p>
                <div className="grid grid-cols-2 gap-3">
                  {['english', 'hindi'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleSelect('language', lang)}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        settings.language === lang
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                          : darkMode
                            ? 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                            : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className={`p-6 rounded-2xl border mb-6 ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
              : 'bg-white border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-2 mb-6">
              <Bell className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h2 className="text-2xl font-bold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    Receive updates and reminders
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('notifications')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.notifications ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.notifications ? 'transform translate-x-7' : ''
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Email Updates</p>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    Get weekly spiritual insights via email
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('emailUpdates')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.emailUpdates ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.emailUpdates ? 'transform translate-x-7' : ''
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Daily Verse Reminders</p>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    Receive a verse notification every morning
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('verseReminders')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.verseReminders ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.verseReminders ? 'transform translate-x-7' : ''
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Sound Effects</p>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    Play sounds for interactions
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('soundEffects')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.soundEffects ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.soundEffects ? 'transform translate-x-7' : ''
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Preferences */}
          <div className={`p-6 rounded-2xl border mb-6 ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
              : 'bg-white border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-2 mb-6">
              <Globe className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h2 className="text-2xl font-bold">Chat Preferences</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-3">Default Conversation Mode</p>
                <div className="grid grid-cols-3 gap-3">
                  {['socratic', 'wisdom', 'story'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleSelect('defaultMode', mode)}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        settings.defaultMode === mode
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                          : darkMode
                            ? 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                            : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Auto-Save Conversations</p>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    Automatically save all your chats
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('autoSave')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.autoSave ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.autoSave ? 'transform translate-x-7' : ''
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className={`p-6 rounded-2xl border mb-6 ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
              : 'bg-white border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-2 mb-6">
              <Shield className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h2 className="text-2xl font-bold">Privacy & Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Anonymous Data Sharing</p>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                    Help improve GitaGPT with anonymized usage data
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('dataSharing')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.dataSharing ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.dataSharing ? 'transform translate-x-7' : ''
                  }`}></div>
                </button>
              </div>

              <button className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                darkMode
                  ? 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}>
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </button>

              <button className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                darkMode
                  ? 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}>
                <Download className="w-5 h-5" />
                <span>Download My Data</span>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={`p-6 rounded-2xl border ${
            darkMode 
              ? 'bg-gradient-to-br from-red-900/20 to-slate-800/40 border-red-700/30'
              : 'bg-red-50 border-red-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-2 mb-6">
              <Trash2 className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-red-100 text-red-700 hover:bg-red-200">
                <Trash2 className="w-5 h-5" />
                <span>
                    Clear All Conversations</span>
              </button>

              <button className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-red-500 text-white hover:bg-red-600">
                <Trash2 className="w-5 h-5" />
                <span>Delete Account</span>
              </button>

              <p className={`text-sm text-center ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                Warning: These actions cannot be undone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
                