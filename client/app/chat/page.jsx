'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, BookOpen, Brain, MessageSquare, Smile, Heart, Cloud, Zap, Loader2, RotateCcw, Copy, Share2, Star, ChevronDown, AlertCircle } from 'lucide-react';
import { sendChatMessage, createSession } from '@/lib/api';

const ChatInterface = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('wisdom');
  const [showModeInfo, setShowModeInfo] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const modes = [
    { 
      id: 'wisdom', 
      icon: BookOpen, 
      label: 'Wisdom', 
      description: 'Direct teachings and clear insights from Krishna',
      color: 'orange'
    },
    { 
      id: 'socratic', 
      icon: Brain, 
      label: 'Socratic', 
      description: 'Guided self-discovery through thoughtful questions',
      color: 'purple'
    },
    { 
      id: 'story', 
      icon: MessageSquare, 
      label: 'Story', 
      description: 'Narrative context and stories from the Mahabharata',
      color: 'blue'
    }
  ];

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await createSession(mode);
        setSessionId(session.id);
      } catch (err) {
        console.error('Failed to create session:', err);
        // Continue without session - will be created on first message
      }
    };
    
    initSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await sendChatMessage(currentInput, sessionId, mode);
      
      // Update session ID if it was created
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
      }
      
      // Create AI message from response
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.reflection,
        emotion: response.emotion,
        verses: response.verses,
        timestamp: new Date(),
        confidence: response.emotion?.confidence || null,
        intent: response.intent,
        intent_confidence: response.intent_confidence
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'error',
        content: 'I apologize, but I encountered an error processing your message. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Could add a toast notification here
  };

  const currentMode = modes.find(m => m.id === mode);

  return (
    <div className={`flex flex-col h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-md border-b transition-all ${
        darkMode 
          ? 'bg-slate-900/80 border-amber-900/30' 
          : 'bg-white/80 border-amber-200/50'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                darkMode ? 'bg-amber-900/30' : 'bg-orange-100'
              }`}>
                <Sparkles className={`w-6 h-6 ${
                  darkMode ? 'text-amber-400' : 'text-orange-600'
                }`} />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${
                  darkMode ? 'text-amber-100' : 'text-slate-900'
                }`}>
                  GitaGPT Companion
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-amber-300' : 'text-slate-600'
                }`}>
                  Your spiritual guide powered by AI
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-300' 
                  : 'bg-orange-100 hover:bg-orange-200 text-orange-600'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mode Selector */}
          <div className="relative">
            <button
              onClick={() => setShowModeInfo(!showModeInfo)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                darkMode
                  ? 'bg-slate-800/50 hover:bg-slate-800 border border-amber-700/30'
                  : 'bg-white hover:bg-gray-50 border border-amber-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {React.createElement(currentMode.icon, { 
                  className: `w-5 h-5 text-${currentMode.color}-500` 
                })}
                <div className="text-left">
                  <p className={`font-semibold ${
                    darkMode ? 'text-amber-100' : 'text-slate-900'
                  }`}>
                    {currentMode.label} Mode
                  </p>
                  <p className={`text-xs ${
                    darkMode ? 'text-amber-300' : 'text-slate-600'
                  }`}>
                    {currentMode.description}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${
                showModeInfo ? 'rotate-180' : ''
              } ${darkMode ? 'text-amber-400' : 'text-slate-600'}`} />
            </button>

            {showModeInfo && (
              <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-xl border z-10 ${
                darkMode
                  ? 'bg-slate-800 border-amber-700/30'
                  : 'bg-white border-amber-200 shadow-xl'
              }`}>
                {modes.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id);
                      setShowModeInfo(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      mode === m.id
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                        : darkMode
                        ? 'hover:bg-slate-700 text-amber-200'
                        : 'hover:bg-gray-100 text-slate-700'
                    }`}
                  >
                    {React.createElement(m.icon, { className: 'w-5 h-5' })}
                    <div className="text-left flex-1">
                      <p className="font-semibold">{m.label}</p>
                      <p className={`text-xs ${
                        mode === m.id ? 'text-white/80' : 'opacity-75'
                      }`}>
                        {m.description}
                      </p>
                    </div>
                    {mode === m.id && <Zap className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Error Banner */}
          {error && (
            <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
              darkMode
                ? 'bg-red-900/20 border-red-700/30 text-red-200'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-sm underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className={`inline-flex p-6 rounded-full mb-6 ${
                darkMode ? 'bg-amber-900/30' : 'bg-orange-100'
              }`}>
                <Heart className={`w-16 h-16 ${
                  darkMode ? 'text-amber-400' : 'text-orange-500'
                }`} />
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${
                darkMode ? 'text-amber-100' : 'text-slate-900'
              }`}>
                Welcome, Seeker 🙏
              </h2>
              <p className={`text-lg mb-6 ${
                darkMode ? 'text-amber-200' : 'text-slate-600'
              }`}>
                Share what's on your mind. I'm here to guide you with wisdom from the Bhagavad Gita.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
                {[
                  { icon: Brain, text: "I understand your emotions", color: "blue" },
                  { icon: BookOpen, text: "I find relevant verses", color: "orange" },
                  { icon: Sparkles, text: "I provide personalized guidance", color: "purple" }
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      darkMode
                        ? 'bg-slate-800/50 border-amber-700/30'
                        : 'bg-white border-amber-200 shadow-lg'
                    }`}
                  >
                    {React.createElement(feature.icon, {
                      className: `w-8 h-8 mx-auto mb-3 text-${feature.color}-500`
                    })}
                    <p className={`text-sm ${
                      darkMode ? 'text-amber-200' : 'text-slate-700'
                    }`}>
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, idx) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              <div className={`max-w-[85%] ${
                message.role === 'user' ? 'ml-12' : 'mr-12'
              }`}>
                {/* User Message */}
                {message.role === 'user' && (
                  <div className="relative group">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl rounded-tr-sm px-6 py-4 shadow-lg">
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs mt-2 opacity-75">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {message.role === 'error' && (
                  <div className={`rounded-2xl rounded-tl-sm p-6 border-2 ${
                    darkMode
                      ? 'bg-red-900/20 border-red-700/30'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className={`w-6 h-6 flex-shrink-0 ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`font-semibold mb-2 ${
                          darkMode ? 'text-red-200' : 'text-red-800'
                        }`}>
                          Error
                        </p>
                        <p className={`leading-relaxed ${
                          darkMode ? 'text-red-300' : 'text-red-700'
                        }`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <p className={`text-xs mt-4 ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}

                {/* AI Message */}
                {message.role === 'assistant' && (
                  <div className={`rounded-2xl rounded-tl-sm p-6 ${
                    darkMode
                      ? 'bg-gradient-to-br from-slate-800/90 to-amber-900/20 border border-amber-700/30'
                      : 'bg-white border border-amber-200 shadow-xl'
                  }`}>
                    {/* Emotion Indicator */}
                    {message.emotion && (
                      <div className={`inline-flex items-center space-x-3 mb-4 px-4 py-2 rounded-full ${
                        darkMode ? 'bg-slate-700/50' : 'bg-orange-50'
                      }`}>
                        <span className="text-2xl">{message.emotion.emoji}</span>
                        <div>
                          <p className={`text-sm font-semibold ${
                            darkMode ? 'text-amber-200' : 'text-slate-800'
                          }`}>
                            Detected: {message.emotion.label}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-24 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                style={{ width: `${message.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs opacity-75">
                              {Math.round(message.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Verses */}
                    {message.verses && message.verses.length > 0 && (
                      <div className="space-y-4 mb-6">
                        {message.verses.map((verse, vIdx) => (
                          <div
                            key={vIdx}
                            className={`p-5 rounded-xl border-l-4 ${
                              darkMode
                                ? 'bg-amber-900/20 border-amber-500'
                                : 'bg-gradient-to-r from-amber-50 to-orange-50 border-orange-500'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-bold text-orange-600">
                                📖 Chapter {verse.chapter}, Verse {verse.verse}
                              </p>
                              <button
                                onClick={() => copyMessage(verse.shloka)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  darkMode ? 'hover:bg-slate-700' : 'hover:bg-orange-100'
                                }`}
                              >
                                <Copy className="w-4 h-4 opacity-50" />
                              </button>
                            </div>
                            <p className={`font-serif text-xl mb-3 leading-relaxed ${
                              darkMode ? 'text-amber-200' : 'text-slate-800'
                            }`}>
                              {verse.shloka}
                            </p>
                            {verse.transliteration && (
                              <p className={`text-sm italic mb-2 ${
                                darkMode ? 'text-amber-300' : 'text-slate-600'
                              }`}>
                                {verse.transliteration}
                              </p>
                            )}
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-amber-100' : 'text-slate-700'
                            }`}>
                              {verse.eng_meaning || verse.meaning}
                            </p>
                            {verse.similarity_score && (
                              <p className={`text-xs mt-2 ${
                                darkMode ? 'text-amber-400' : 'text-slate-500'
                              }`}>
                                Relevance: {Math.round(verse.similarity_score * 100)}%
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Response */}
                    <p className={`leading-relaxed mb-4 ${
                      darkMode ? 'text-amber-100' : 'text-slate-800'
                    }`}>
                      {message.content}
                    </p>

                    {/* Message Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-amber-700/20">
                      <p className={`text-xs ${
                        darkMode ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'hover:bg-slate-700 text-amber-300'
                              : 'hover:bg-orange-100 text-slate-600'
                          }`}
                          title="Copy message"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'hover:bg-slate-700 text-amber-300'
                              : 'hover:bg-orange-100 text-slate-600'
                          }`}
                          title="Save to favorites"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'hover:bg-slate-700 text-amber-300'
                              : 'hover:bg-orange-100 text-slate-600'
                          }`}
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className={`max-w-[85%] mr-12 rounded-2xl rounded-tl-sm p-6 ${
                darkMode
                  ? 'bg-gradient-to-br from-slate-800/90 to-amber-900/20 border border-amber-700/30'
                  : 'bg-white border border-amber-200 shadow-xl'
              }`}>
                <div className="flex items-center space-x-4">
                  <Loader2 className={`w-6 h-6 animate-spin ${
                    darkMode ? 'text-amber-400' : 'text-orange-500'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      darkMode ? 'text-amber-200' : 'text-slate-800'
                    }`}>
                      Contemplating your words...
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full animate-bounce ${
                              darkMode ? 'bg-amber-400' : 'bg-orange-500'
                            }`}
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${
                        darkMode ? 'text-amber-400' : 'text-slate-600'
                      }`}>
                        Analyzing emotions → Finding verses → Crafting response
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`border-t backdrop-blur-md ${
        darkMode 
          ? 'bg-slate-900/80 border-amber-900/30' 
          : 'bg-white/80 border-amber-200/50'
      }`}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... (Press Enter to send)"
                className={`w-full px-4 py-3 pr-12 rounded-xl resize-none border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  darkMode
                    ? 'bg-slate-800 border-amber-700/30 text-amber-100 placeholder-amber-400/50'
                    : 'bg-white border-amber-200 text-slate-900 placeholder-slate-400'
                }`}
                disabled={loading}
                rows={input.split('\n').length > 3 ? 4 : Math.max(1, input.split('\n').length)}
              />
              <button
                onClick={() => setInput('')}
                className={`absolute right-3 bottom-3 p-1.5 rounded-lg transition-colors ${
                  input.trim()
                    ? darkMode
                      ? 'hover:bg-slate-700 text-amber-400'
                      : 'hover:bg-gray-100 text-slate-600'
                    : 'opacity-0'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                loading || !input.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>

          <div className={`mt-3 flex items-center justify-between text-xs ${
            darkMode ? 'text-amber-400' : 'text-slate-500'
          }`}>
            <p>
              <span className="font-semibold">Shift + Enter</span> for new line • Powered by RoBERTa + ChromaDB + Gemini
            </p>
            <p>
              {input.length} characters
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;