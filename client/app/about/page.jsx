'use client';
import React, { useState } from 'react';
import { BookOpen, Heart, Sparkles, Github, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function AboutUs() {
  const [darkMode, setDarkMode] = useState(false);

  const team = [
    {
      name: 'Ayush Bhatnagar',
      semester: '5th Semester',
      program: 'Integrated CSE-MBA',
      rollNo: '23BTM007',
      github: 'https://github.com/AyushBhatnagar10',
      linkedin: 'https://linkedin.com/in/AyushBhatnagar',
      instagram: 'https://instagram.com/schobo10'
    },
    {
      name: 'Bhavya Mishra',
      semester: '5th Semester',
      program: 'Integrated CSE-MBA',
      rollNo: '23BTM010',
      github: 'https://github.com/bhavyamishra',
      linkedin: 'https://linkedin.com/in/bhavyamishra',
      instagram: 'https://instagram.com/bhavyamishra'
    },
    {
      name: 'Ishita Bhatt',
      semester: '5th Semester',
      program: 'Integrated CSE-MBA',
      rollNo: '23BTM009',
      github: 'https://github.com/ishitabhatt',
      linkedin: 'https://linkedin.com/in/ishitabhatt',
      instagram: 'https://instagram.com/ishitabhatt'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-amber-50' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800'
    }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-900/80 backdrop-blur-md border-b border-amber-900/30' 
          : 'bg-white/80 backdrop-blur-md border-b border-amber-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                GitaGPT
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <Link href="/about" className="text-orange-500">About</Link>
              <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              darkMode ? 'text-amber-100' : 'text-slate-900'
            }`}>
              About GitaGPT
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-amber-200' : 'text-slate-600'
            }`}>
              Your AI-powered spiritual companion, bridging ancient wisdom with modern technology
            </p>
          </div>

          {/* Story Section */}
          <div className={`p-8 rounded-2xl border mb-12 ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
              : 'bg-white border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-3 mb-6">
              <Heart className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h2 className="text-3xl font-bold">Our Story</h2>
            </div>
            <div className="space-y-4 text-lg">
              <p>
                GitaGPT was born from a simple observation by three students at Nirma University: 
                in today's fast-paced world, people need a companion they can talk to anytime, 
                someone who listens without judgment and provides thoughtful guidance. What better 
                source of wisdom than the timeless teachings of the Bhagavad Gita?
              </p>
              <p>
                We envisioned more than just another chatbot that quotes verses. We wanted to create 
                a truly <span className="font-semibold text-orange-600">emotionally intelligent companion</span> — 
                one that understands not just what you're saying, but how you're feeling.
              </p>
            </div>
          </div>

          {/* Bhagavad Gita Section */}
          <div className={`p-8 rounded-2xl border mb-12 ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
              : 'bg-gradient-to-br from-white to-amber-50 border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h2 className="text-3xl font-bold">The Bhagavad Gita: Timeless Wisdom</h2>
            </div>
            <div className="space-y-4 text-lg">
              <p>
                The Bhagavad Gita, spoken over 5,000 years ago on the battlefield of Kurukshetra, 
                contains profound answers to life's most challenging questions. When warrior Arjuna 
                faced a moral crisis, Lord Krishna didn't just give him commands — He engaged in 
                dialogue, asked questions, and guided him to discover his own truth.
              </p>
              <p>
                The Gita addresses universal human experiences: doubt, fear, purpose, duty, love, 
                and loss. Its 700 verses offer practical wisdom applicable to modern life, making 
                it the perfect foundation for an AI spiritual companion.
              </p>
            </div>
          </div>

          {/* Technology Section */}
          <div className={`p-8 rounded-2xl border mb-12 ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
              : 'bg-white border-amber-200 shadow-lg'
          }`}>
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <h2 className="text-3xl font-bold">What Makes GitaGPT Different?</h2>
            </div>
            <div className="space-y-6">
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-slate-800/50' : 'bg-orange-50'
              }`}>
                <h3 className="font-bold text-xl mb-2">🧠 Emotional Intelligence</h3>
                <p>
                  Unlike traditional chatbots that simply match keywords to verses, GitaGPT uses 
                  <span className="font-semibold"> RoBERTa's GoEmotions transformer model</span> from 
                  Hugging Face, trained on Google's extensive GoEmotions dataset. It truly understands 
                  your emotional state — whether you're anxious, confused, joyful, or grieving.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-slate-800/50' : 'bg-orange-50'
              }`}>
                <h3 className="font-bold text-xl mb-2">💬 Natural Conversations</h3>
                <p>
                  Powered by <span className="font-semibold">Gemini API</span>, GitaGPT responds like 
                  a wise friend, not a scripture-quoting bot. It combines your emotional context with 
                  relevant verses to provide guidance that feels personal and compassionate.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-slate-800/50' : 'bg-orange-50'
              }`}>
                <h3 className="font-bold text-xl mb-2">🎭 Multiple Interaction Modes</h3>
                <p>
                  Choose how you want to explore wisdom: <span className="font-semibold">Socratic mode</span> for 
                  reflective questioning, <span className="font-semibold">Wisdom mode</span> for direct guidance, 
                  or <span className="font-semibold">Story mode</span> for contextual narratives from the Mahabharata.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-slate-800/50' : 'bg-orange-50'
              }`}>
                <h3 className="font-bold text-xl mb-2">🔒 Secure & Private</h3>
                <p>
                  Built with <span className="font-semibold">Google Firebase</span> for authentication 
                  and <span className="font-semibold">Supabase</span> for data storage, ensuring your 
                  conversations remain private and secure.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <h2 className={`text-4xl font-bold text-center mb-8 ${
              darkMode ? 'text-amber-100' : 'text-slate-900'
            }`}>
              Meet The Team
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    darkMode 
                      ? 'bg-slate-800/50 border-amber-700/50 hover:border-amber-500 hover:bg-slate-800'
                      : 'bg-white border-slate-300 hover:border-orange-500 hover:shadow-orange-200'
                  }`}
                  style={{
                    borderStyle: 'dashed'
                  }}
                >
                  <div className="text-center">
                    <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold ${
                      darkMode 
                        ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white'
                        : 'bg-gradient-to-br from-orange-400 to-amber-400 text-white'
                    }`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${
                      darkMode ? 'text-amber-100' : 'text-slate-900'
                    }`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm mb-1 ${
                      darkMode ? 'text-amber-300' : 'text-orange-600'
                    }`}>
                      {member.program}
                    </p>
                    <p className={`text-sm mb-2 ${
                      darkMode ? 'text-amber-400' : 'text-slate-600'
                    }`}>
                      {member.semester} • {member.rollNo}
                    </p>
                    <div className="flex justify-center space-x-4 mt-4">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'hover:bg-slate-700 text-amber-300'
                            : 'hover:bg-gray-100 text-slate-600'
                        }`}
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'hover:bg-slate-700 text-amber-300'
                            : 'hover:bg-gray-100 text-blue-600'
                        }`}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'hover:bg-slate-700 text-amber-300'
                            : 'hover:bg-gray-100 text-pink-600'
                        }`}
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <div className={`p-8 rounded-2xl border text-center ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
              : 'bg-gradient-to-br from-orange-100 to-amber-100 border-amber-300 shadow-lg'
          }`}>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl max-w-3xl mx-auto">
              To make ancient wisdom accessible, relevant, and emotionally resonant for the modern seeker — 
              one conversation at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-8 px-4 border-t ${
        darkMode ? 'bg-slate-900/50 border-amber-900/30' : 'bg-white/50 border-amber-200'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={darkMode ? 'text-amber-300' : 'text-slate-600'}>
            © 2025 GitaGPT. Built with devotion by Nirma University students.
          </p>
        </div>
      </footer>
    </div>
  );
}