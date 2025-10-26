'use client';
import React, { useState } from 'react';
import { Mail, Phone,MapPin, Send, CheckCircle } from 'lucide-react';
import { Sun, Moon, ChevronUp, MessageCircle, BookOpen, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useThemeMode } from '@/hooks/useThemeMode';

export default function ContactUs() {
  const [darkMode, setDarkMode] = useThemeMode();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    query: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({ name: '', phone: '', email: '', query: '' });
  };

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode 
        ? 'dark' 
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
              <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent 
                  transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">
                  GitaGPT
                </span>
              </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <Link href="/about" className="hover:text-orange-500 transition-colors">About</Link>
              <Link href="/contact" className="text-orange-500">Contact</Link>
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

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-5xl font-bold text-center mb-4 ${
            darkMode ? 'text-amber-100' : 'text-slate-900'
          }`}>
            Get In Touch
          </h1>
          <p className={`text-center text-xl mb-12 ${
            darkMode ? 'text-amber-200' : 'text-slate-600'
          }`}>
            We'd love to hear from you. Reach out to us anytime!
          </p>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Map Section */}
            <div className={`rounded-2xl overflow-hidden border ${
              darkMode ? 'border-amber-700/30' : 'border-amber-200'
            }`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.1366699990326!2d72.5428674753171!3d23.128679179099557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e832f45125167%3A0x876cb1cb23c25bdb!2sNirma%20University!5e0!3m2!1sen!2sin!4v1761473028703!5m2!1sen!2sin"
                height="400"
                width="600"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className={`p-6 ${
                darkMode ? 'bg-slate-800/50' : 'bg-white'
              }`}>
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin className={`w-5 h-5 mt-1 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
                  <div>
                    <p className="font-semibold mb-1">Our Location</p>
                    <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                      N Block, 5th Floor<br />
                      Nirma University<br />
                      Ahmedabad, Gujarat, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info & Form */}
            <div className="space-y-6">
              {/* Contact Details */}
              <div className={`p-6 rounded-2xl border ${
                darkMode 
                  ? 'bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-700/30'
                  : 'bg-white border-amber-200 shadow-lg'
              }`}>
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
                    <div>
                      <p className="text-sm opacity-75">Phone</p>
                      <p className="font-semibold">+91 9876543210</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
                    <div>
                      <p className="text-sm opacity-75">Email</p>
                      <p className="font-semibold">support@gitagpt.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className={`p-6 rounded-2xl border ${
                darkMode 
                  ? 'bg-gradient-to-br from-slate-800/50 to-amber-900/30 border-amber-700/20'
                  : 'bg-white border-amber-200 shadow-lg'
              }`}>
                <h3 className="text-2xl font-bold mb-4">Connect With Us!</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-800 border-amber-700 text-amber-100' 
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-800 border-amber-700 text-amber-100' 
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-800 border-amber-700 text-amber-100' 
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                  />
                  <textarea
                    name="query"
                    value={formData.query}
                    onChange={handleChange}
                    placeholder="Type your query here..."
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-800 border-amber-700 text-amber-100' 
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                  ></textarea>
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-8 rounded-2xl max-w-sm w-full mx-4 ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-700/30'
              : 'bg-white shadow-2xl'
          }`}>
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className={darkMode ? 'text-amber-200' : 'text-slate-600'}>
                We'll contact you soon!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`py-8 px-4 border-t ${
        darkMode ? 'bg-slate-900/50 border-amber-900/30' : 'bg-white/50 border-amber-200'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={darkMode ? 'text-amber-300' : 'text-slate-600'}>
            © 2025 GitaGPT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}