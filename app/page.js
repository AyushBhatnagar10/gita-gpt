"use client";
//Keep the "use client"; line at the very top — this is required for hooks like useState and useEffect to work 
// in Next.js App Router.
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Mail, Lock, ChevronUp, MessageCircle, BookOpen, Heart } from 'lucide-react';

const GeetaGPTLanding = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentShlokaIndex, setCurrentShlokaIndex] = useState(0);

  const shlokas = [
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
      sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत",
      transliteration: "Yada yada hi dharmasya glanir bhavati bharata",
      meaning: "Whenever there is a decline in righteousness and rise in unrighteousness, O Bharata",
      chapter: "Chapter 4, Verse 7"
    }
  ];

  const storySnippets = [
    {
      title: "The Divine Discourse",
      text: "On the battlefield of Kurukshetra, when Arjuna was overwhelmed with doubt, Lord Krishna revealed timeless wisdom that transcends all ages."
    },
    {
      title: "The Chariot of Wisdom",
      text: "Between two armies stood a chariot, where the greatest conversation in human history unfolded - not about war, but about life, duty, and the self."
    },
    {
      title: "Beyond the Battle",
      text: "The Bhagavad Gita teaches us that life itself is a battlefield, and wisdom lies in performing our duties with devotion and detachment."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShlokaIndex((prev) => (prev + 1) % shlokas.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-In will be implemented with Firebase in production');
  };

  const handleEmailAuth = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    alert(`${isSignUp ? 'Sign Up' : 'Sign In'} will be implemented with Firebase`);
  };

  const currentShloka = shlokas[currentShlokaIndex];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-amber-50' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800'
    }`}>
      
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-900/80 backdrop-blur-md border-b border-amber-900/30' 
          : 'bg-white/80 backdrop-blur-md border-b border-amber-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                GeetaGPT
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#home" className="hover:text-orange-500 transition-colors">Home</a>
              <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
              <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
              <button
                onClick={() => setShowAuthModal(true)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  darkMode 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-amber-900/50 hover:bg-amber-900' : 'bg-orange-100 hover:bg-orange-200'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              darkMode ? 'text-amber-100' : 'text-slate-900'
            }`}>
              Your Emotionally Intelligent
              <span className="block bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                Spiritual Companion
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${
              darkMode ? 'text-amber-200' : 'text-slate-600'
            }`}>
              Ancient wisdom meets modern AI to guide you through life's challenges
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Begin Your Journey
            </button>
          </div>

          <div className={`max-w-4xl mx-auto p-8 rounded-2xl transition-all duration-1000 ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border border-amber-700/30' 
              : 'bg-white/60 border border-amber-200 shadow-xl'
          }`}>
            <div className="text-center space-y-4">
              <p className="text-sm text-orange-600 font-semibold">{currentShloka.chapter}</p>
              <p className={`text-3xl font-serif mb-4 ${darkMode ? 'text-amber-200' : 'text-orange-800'}`}>
                {currentShloka.sanskrit}
              </p>
              <p className={`text-lg italic ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                {currentShloka.transliteration}
              </p>
              <p className={`text-xl ${darkMode ? 'text-amber-100' : 'text-slate-700'}`}>
                "{currentShloka.meaning}"
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${
            darkMode ? 'text-amber-100' : 'text-slate-900'
          }`}>
            How GeetaGPT+ Guides You
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-6 rounded-xl transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-amber-900/30 border border-amber-700/30' 
                : 'bg-white shadow-lg border border-amber-100'
            }`}>
              <Heart className={`w-12 h-12 mb-4 ${darkMode ? 'text-amber-400' : 'text-orange-500'}`} />
              <h3 className="text-2xl font-bold mb-3">Emotion Detection</h3>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                AI understands your emotional state to provide perfectly aligned spiritual guidance
              </p>
            </div>
            <div className={`p-6 rounded-xl transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-amber-900/30 border border-amber-700/30' 
                : 'bg-white shadow-lg border border-amber-100'
            }`}>
              <BookOpen className={`w-12 h-12 mb-4 ${darkMode ? 'text-amber-400' : 'text-orange-500'}`} />
              <h3 className="text-2xl font-bold mb-3">Personalized Wisdom</h3>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                Receive verses from the Bhagavad Gita tailored to your unique situation and feelings
              </p>
            </div>
            <div className={`p-6 rounded-xl transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-amber-900/30 border border-amber-700/30' 
                : 'bg-white shadow-lg border border-amber-100'
            }`}>
              <MessageCircle className={`w-12 h-12 mb-4 ${darkMode ? 'text-amber-400' : 'text-orange-500'}`} />
              <h3 className="text-2xl font-bold mb-3">Mood Tracking</h3>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                Track your emotional journey over time with beautiful calendar visualizations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${
            darkMode ? 'text-amber-100' : 'text-slate-900'
          }`}>
            Wisdom from the Battlefield
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {storySnippets.map((snippet, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl ${
                  darkMode 
                    ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border border-amber-700/20' 
                    : 'bg-gradient-to-br from-white to-amber-50 shadow-lg border border-amber-200'
                }`}
              >
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-amber-300' : 'text-orange-700'}`}>
                  {snippet.title}
                </h3>
                <p className={darkMode ? 'text-amber-100' : 'text-slate-600'}>
                  {snippet.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className={`py-12 px-4 border-t ${
        darkMode ? 'bg-slate-900/50 border-amber-900/30' : 'bg-white/50 border-amber-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">GeetaGPT+</h4>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                Combining ancient wisdom with modern AI to provide compassionate spiritual guidance
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#home" className="block hover:text-orange-500 transition-colors">Home</a>
                <a href="#about" className="block hover:text-orange-500 transition-colors">About</a>
                <a href="#contact" className="block hover:text-orange-500 transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Us</h4>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                Email: support@geetagptplus.com
              </p>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                For guidance and support
              </p>
            </div>
          </div>
          <div className={`text-center pt-8 border-t ${
            darkMode ? 'border-amber-900/30' : 'border-amber-200'
          }`}>
            <p className={darkMode ? 'text-amber-300' : 'text-slate-600'}>
              © 2025 GeetaGPT+. All rights reserved. Built with devotion and technology.
            </p>
          </div>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
          darkMode 
            ? 'bg-amber-600 hover:bg-amber-700 text-white' 
            : 'bg-orange-500 hover:bg-orange-600 text-white'
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-2xl p-8 ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-700/30' 
              : 'bg-white shadow-2xl'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-2xl hover:text-orange-500"
              >
                ×
              </button>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className={`w-full py-3 rounded-lg mb-4 font-semibold transition-all flex items-center justify-center space-x-2 ${
                darkMode 
                  ? 'bg-white text-slate-900 hover:bg-gray-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-amber-700' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>Or continue with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-800 border-amber-700 text-amber-100' 
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-800 border-amber-700 text-amber-100' 
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                onClick={handleEmailAuth}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-xl transition-all"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </div>

            <p className="text-center mt-6 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-orange-500 font-semibold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeetaGPTLanding;