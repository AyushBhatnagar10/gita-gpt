'use client';
import React, { useState } from 'react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { Sun, Moon, ChevronUp, MessageCircle, BookOpen, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import SignUpModal from '@/components/shared/auth/SignUpModal';
import SignInModal from '@/components/shared/auth/SignInModal';

const GeetaGPTLanding = () => {
  const [darkMode, setDarkMode] = useThemeMode();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [currentShlokaIndex, setCurrentShlokaIndex] = useState(0);

  // Add CSS animation for fade effect
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
    },
    {
      sanskrit: "तं विद्याद् दुःखसंयोगवियोगं योगसंज्ञितम्। स निश्चयेन योक्तव्यो योगोऽनिर्विण्णचेतसा।।",
      transliteration: "taṃ vidyād duḥkhasaṃyogaviyogaṃ yogasaṃjñitam sa niścayena yoktavyo yogo'nirviṇṇacetasā",
      meaning: "Let it be known: the severance from the union-with-pain is YOGA. This YOGA should be practised with determination and with a mind steady and undespairing.",
      chapter: "Chapter 6, Verse 23"
    },
    {
      sanskrit: "मय्येव मन आधत्स्व मयि बुद्धिं निवेशय। निवसिष्यसि मय्येव अत ऊर्ध्वं न संशयः।।",
      transliteration: "mayyeva mana ādhatsva mayi buddhiṃ niveśaya nivasishiyasi mayyeva ata ūrdhvaṃ na saṃśayaḥ",
      meaning: "Fix your mind on Me alone. Let your intellect dwell in Me. Thus you shall live in Me alone. There is no doubt about this.",
      chapter: "Chapter 12, Verse 8"
    },
    {
      sanskrit: "वेदाविनाशिनं नित्यं य एनमजमव्ययम्‌ । कथं स पुरुषः पार्थ कं घातयति हन्ति कम्‌ ॥",
      transliteration: "vedāvināśinaṃ nityaṃ ya enamajamavyayam kathaṃ sa puruṣaḥ pārtha kaṃ ghātayati hanti kam",
      meaning: "O Partha, how can a person who knows that the soul is indestructible, unborn, eternal and immutable, kill anyone or cause anyone to kill?",
      chapter: "Chapter 2, Verse 21"
    },
    {
      sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः । आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ।।",
      transliteration: "mātrā-sparśhās tu kaunteya śhītoṣhṇa-sukha-duḥkha-dāḥ āgamāpāyino 'nityās tans-titikṣhasva bhārata",
      meaning: "O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, O scion of Bharata, and one must learn to tolerate them without being disturbed.",
      chapter: "Chapter 2, Verse 14"
    },
    {
      sanskrit: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु। मामेवैष्यसि युक्त्वैवमात्मानं मत्परायणः।।",
      transliteration: "manmanā bhava madbhakto madyājī māṃ namaskuru māmevaiṣyasi yuktvaivamātmānaṃ matparāyaṇaḥ",
      meaning: "Engage your mind always in thinking of Me, offer obeisances and worship Me. Being completely absorbed in Me, surely you will come to Me.",
      chapter: "Chapter 9, Verse 34"
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

  const nextShloka = () => {
    setCurrentShlokaIndex((prev) => (prev + 1) % shlokas.length);
  };

  const prevShloka = () => {
    setCurrentShlokaIndex((prev) => (prev - 1 + shlokas.length) % shlokas.length);
  };

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevShloka();
      if (e.key === 'ArrowRight') nextShloka();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShlokaIndex((prev) => (prev + 1) % shlokas.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentShloka = shlokas[currentShlokaIndex];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'dark' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800'
    }`}>
      
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-900/80 backdrop-blur-md border-b border-amber-900/30' 
          : 'bg-white/80 backdrop-blur-md border-b border-amber-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent 
                  transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">
                  GitaGPT
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
              <a href="/" className="hidden sm:block hover:text-orange-500 transition-colors cursor-pointer text-sm md:text-base">Home</a>
              <a href="/about/" className="hidden sm:block hover:text-orange-500 transition-colors cursor-pointer text-sm md:text-base">About</a>
              <a href="/contact/" className="hidden sm:block hover:text-orange-500 transition-colors cursor-pointer text-sm md:text-base">Contact</a>
              <button
                onClick={() => setShowSignIn(true)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-all cursor-pointer hover:scale-105 hover:shadow-lg ${
                  darkMode 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-orange-500 hover:bg-orange-400 text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer hover:scale-110 ${
                  darkMode ? 'bg-amber-900/50 hover:bg-amber-800' : 'bg-orange-100 hover:bg-orange-200'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight ${
              darkMode ? 'text-amber-100' : 'text-slate-900'
            }`}>
              Your Emotionally Intelligent
              <span className="block bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                Spiritual Companion
              </span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 px-4 ${
              darkMode ? 'text-amber-200' : 'text-slate-600'
            }`}>
              Ancient wisdom meets modern AI to guide you through life's challenges
            </p>
            <button
              onClick={() => setShowSignUp(true)}
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:from-orange-400 hover:to-amber-500"
            >
              Begin Your Journey
            </button>
          </div>

          <div className={`max-w-4xl mx-auto p-4 sm:p-8 rounded-2xl transition-all duration-700 relative ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border border-amber-700/30' 
              : 'bg-white/60 border border-amber-200 shadow-xl'
          }`}>
            <button
              onClick={prevShloka}
              className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full transition-all hover:scale-110 cursor-pointer z-10 ${
                darkMode 
                  ? 'bg-amber-600/80 hover:bg-amber-600 text-white' 
                  : 'bg-orange-500/80 hover:bg-orange-600 text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={nextShloka}
              className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full transition-all hover:scale-110 cursor-pointer z-10 ${
                darkMode 
                  ? 'bg-amber-600/80 hover:bg-amber-600 text-white' 
                  : 'bg-orange-500/80 hover:bg-orange-600 text-white'
              }`}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div key={currentShlokaIndex} className="text-center space-y-3 sm:space-y-4 px-12 sm:px-16 animate-[fadeIn_0.7s_ease-in-out]">
              <p className="text-xs sm:text-sm text-orange-600 font-semibold">{currentShloka.chapter}</p>
              <p className={`text-xl sm:text-2xl md:text-3xl font-serif mb-2 sm:mb-4 ${darkMode ? 'text-amber-200' : 'text-orange-800'}`}>
                {currentShloka.sanskrit}
              </p>
              <p className={`text-base sm:text-lg italic ${darkMode ? 'text-amber-300' : 'text-slate-600'}`}>
                {currentShloka.transliteration}
              </p>
              <p className={`text-lg sm:text-xl ${darkMode ? 'text-amber-100' : 'text-slate-700'}`}>
                "{currentShloka.meaning}"
              </p>
              <div className="flex justify-center gap-1 sm:gap-2 pt-3 sm:pt-4">
                {shlokas.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentShlokaIndex(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentShlokaIndex 
                        ? `w-6 sm:w-8 ${darkMode ? 'bg-amber-500' : 'bg-orange-500'}` 
                        : `w-1.5 sm:w-2 ${darkMode ? 'bg-amber-700/50' : 'bg-orange-300'}`
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 md:mb-16 ${
            darkMode ? 'text-amber-100' : 'text-slate-900'
          }`}>
            How GitaGPT Guides You
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className={`p-6 rounded-xl transition-all hover:scale-105 hover:-translate-y-2 hover:shadow-2xl duration-300 cursor-pointer group ${
              darkMode 
                ? 'bg-amber-900/30 border border-amber-700/30 hover:bg-amber-900/50 hover:border-amber-600/50' 
                : 'bg-white shadow-lg border border-amber-100 hover:shadow-2xl hover:border-amber-300'
            }`}>
              <div className="relative">
                <Heart className={`w-12 h-12 mb-4 transition-all duration-300 group-hover:scale-110 ${darkMode ? 'text-amber-400' : 'text-orange-500'}`} />
                <Sparkles className={`w-6 h-6 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${darkMode ? 'text-amber-300' : 'text-orange-400'}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-orange-500">Emotion Detection</h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-amber-200 group-hover:text-amber-100' : 'text-slate-600 group-hover:text-slate-700'}`}>
                AI understands your emotional state to provide perfectly aligned spiritual guidance
              </p>
            </div>
            <div className={`p-6 rounded-xl transition-all hover:scale-105 hover:-translate-y-2 hover:shadow-2xl duration-300 cursor-pointer group ${
              darkMode 
                ? 'bg-amber-900/30 border border-amber-700/30 hover:bg-amber-900/50 hover:border-amber-600/50' 
                : 'bg-white shadow-lg border border-amber-100 hover:shadow-2xl hover:border-amber-300'
            }`}>
              <div className="relative">
                <BookOpen className={`w-12 h-12 mb-4 transition-all duration-300 group-hover:scale-110 ${darkMode ? 'text-amber-400' : 'text-orange-500'}`} />
                <Sparkles className={`w-6 h-6 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${darkMode ? 'text-amber-300' : 'text-orange-400'}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-orange-500">Personalized Wisdom</h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-amber-200 group-hover:text-amber-100' : 'text-slate-600 group-hover:text-slate-700'}`}>
                Receive verses from the Bhagavad Gita tailored to your unique situation and feelings
              </p>
            </div>
            <div className={`p-6 rounded-xl transition-all hover:scale-105 hover:-translate-y-2 hover:shadow-2xl duration-300 cursor-pointer group ${
              darkMode 
                ? 'bg-amber-900/30 border border-amber-700/30 hover:bg-amber-900/50 hover:border-amber-600/50' 
                : 'bg-white shadow-lg border border-amber-100 hover:shadow-2xl hover:border-amber-300'
            }`}>
              <div className="relative">
                <MessageCircle className={`w-12 h-12 mb-4 transition-all duration-300 group-hover:scale-110 ${darkMode ? 'text-amber-400' : 'text-orange-500'}`} />
                <Sparkles className={`w-6 h-6 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${darkMode ? 'text-amber-300' : 'text-orange-400'}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-orange-500">Mood Tracking</h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-amber-200 group-hover:text-amber-100' : 'text-slate-600 group-hover:text-slate-700'}`}>
                Track your emotional journey over time with beautiful calendar visualizations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 md:mb-16 ${
            darkMode ? 'text-amber-100' : 'text-slate-900'
          }`}>
            Wisdom from the Battlefield
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {storySnippets.map((snippet, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 group relative overflow-hidden ${
                  darkMode 
                    ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border border-amber-700/20 hover:border-amber-600/50' 
                    : 'bg-gradient-to-br from-white to-amber-50 shadow-lg border border-amber-200 hover:shadow-2xl hover:border-amber-300'
                }`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode ? 'bg-gradient-to-br from-amber-600/10 to-orange-600/10' : 'bg-gradient-to-br from-orange-50/50 to-amber-50/50'
                }`}></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
                      darkMode ? 'bg-amber-500 group-hover:w-12' : 'bg-orange-500 group-hover:w-12'
                    }`}></div>
                    <Sparkles className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      darkMode ? 'text-amber-400' : 'text-orange-500'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                    darkMode ? 'text-amber-300 group-hover:text-amber-200' : 'text-orange-700 group-hover:text-orange-600'
                  }`}>
                    {snippet.title}
                  </h3>
                  <p className={`transition-colors duration-300 leading-relaxed ${
                    darkMode ? 'text-amber-100 group-hover:text-amber-50' : 'text-slate-600 group-hover:text-slate-700'
                  }`}>
                    {snippet.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className={`py-8 sm:py-12 px-4 border-t ${
        darkMode ? 'bg-slate-900/50 border-amber-900/30' : 'bg-white/50 border-amber-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">GitaGPT</h4>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                Combining ancient wisdom with modern AI to provide compassionate spiritual guidance
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/" className="block hover:text-orange-500 transition-colors cursor-pointer">Home</a>
                <a href="/about/" className="block hover:text-orange-500 transition-colors cursor-pointer">About</a>
                <a href="/contact/" className="block hover:text-orange-500 transition-colors cursor-pointer">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Us</h4>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                Email: support@gitagpt.com
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
              © 2025 GitaGPT. All rights reserved. Built with devotion and technology.
            </p>
          </div>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all hover:scale-110 cursor-pointer ${
          darkMode 
            ? 'bg-amber-600 hover:bg-amber-500 text-white' 
            : 'bg-orange-500 hover:bg-orange-400 text-white'
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {showSignUp && (
        <SignUpModal
          darkMode={darkMode}
          onClose={() => setShowSignUp(false)}
          onSwitchToSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
        />
      )}

      {showSignIn && (
        <SignInModal
          darkMode={darkMode}
          onClose={() => setShowSignIn(false)}
          onSwitchToSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
        />
      )}
    </div>
  );
};

export default GeetaGPTLanding;