'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageCircle, BookOpen, Heart, Brain } from 'lucide-react';
import { useAuth } from '@/components/shared/AuthContext';
import { chatService, conversationService } from '@/lib/api-services';

const ChatInterface = ({ darkMode }) => {
  const { token, currentUser, backendSynced } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [interactionMode, setInteractionMode] = useState('wisdom');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Create new session on mount
    const initSession = async () => {
      if (token && backendSynced) {
        try {
          const response = await conversationService.createSession(token);
          setSessionId(response.session_id);
          console.log('Created new chat session:', response.session_id);
        } catch (error) {
          console.error('Failed to create session:', error);
          setError('Failed to initialize chat session. You can still send messages.');
        }
      }
    };
    initSession();
  }, [token, backendSynced]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!token) {
      setError('Please sign in to start chatting.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    setError(null);

    try {
      console.log('Sending message to backend with complete flow...');
      
      // Call your backend's /api/chat endpoint which handles:
      // 1. RoBERTa emotion detection
      // 2. ChromaDB semantic search for verses
      // 3. Gemini reflection generation with top 3 verses
      const response = await chatService.sendMessage(
        currentInput,
        sessionId,
        interactionMode,
        token
      );

      console.log('Received response from backend:', response);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.reflection,
        emotion: response.emotion,
        verses: response.verses,
        timestamp: new Date(),
        fallbackUsed: response.fallback_used,
        sessionId: response.session_id,
      };

      // Update session ID if it was created by the backend
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id);
      }

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.fallback_used) {
        console.warn('Backend used fallback mechanisms');
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      setError(error.message || 'Failed to get response. Please try again.');
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'error',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date(),
      }]);
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

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'socratic': return <Brain className="w-4 h-4" />;
      case 'wisdom': return <BookOpen className="w-4 h-4" />;
      case 'story': return <MessageCircle className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getModeDescription = (mode) => {
    switch (mode) {
      case 'socratic': return 'Guided self-discovery through questions';
      case 'wisdom': return 'Direct teachings and clear insights';
      case 'story': return 'Narrative context and stories';
      default: return 'Direct teachings and clear insights';
    }
  };

  if (!currentUser) {
    return (
      <div className={`flex items-center justify-center h-full ${
        darkMode ? 'bg-slate-900 text-amber-100' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center">
          <Heart className={`w-16 h-16 mx-auto mb-4 ${
            darkMode ? 'text-amber-400' : 'text-orange-500'
          }`} />
          <h3 className="text-xl font-semibold mb-2">Welcome to GeetaGPT+</h3>
          <p className={darkMode ? 'text-amber-200' : 'text-gray-600'}>
            Please sign in to start your spiritual journey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${
      darkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Header with Mode Selector */}
      <div className={`p-4 border-b ${
        darkMode ? 'border-amber-700/30 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${
              darkMode ? 'text-amber-100' : 'text-gray-900'
            }`}>
              Spiritual Guidance Chat
            </h2>
            {!backendSynced && (
              <div className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                Connecting to backend...
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className={`text-sm font-medium ${
              darkMode ? 'text-amber-200' : 'text-gray-700'
            }`}>
              Interaction Mode:
            </label>
            <div className="flex gap-2 flex-wrap">
              {['wisdom', 'socratic', 'story'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setInteractionMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all ${
                    interactionMode === mode
                      ? 'bg-orange-500 text-white shadow-md'
                      : darkMode
                      ? 'bg-slate-700 text-amber-200 hover:bg-slate-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={getModeDescription(mode)}
                >
                  {getModeIcon(mode)}
                  {mode}
                </button>
              ))}
            </div>
            <p className={`text-xs ${
              darkMode ? 'text-amber-300' : 'text-gray-500'
            }`}>
              {getModeDescription(interactionMode)}
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border-b border-red-200">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-xs underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className={`text-center py-8 ${
            darkMode ? 'text-amber-200' : 'text-gray-500'
          }`}>
            <BookOpen className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? 'text-amber-400' : 'text-orange-500'
            }`} />
            <p className="text-lg font-medium mb-2">Welcome to your spiritual companion</p>
            <p className="text-sm">
              Share what's on your mind, and I'll provide guidance from the Bhagavad Gita
            </p>
            <p className="text-xs mt-2 opacity-75">
              Your messages are analyzed for emotions, matched with relevant verses, and personalized reflections are generated
            </p>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                  : message.role === 'error'
                  ? 'bg-red-500 text-white'
                  : darkMode
                  ? 'bg-gradient-to-br from-slate-800 to-amber-900/20 text-amber-100 border border-amber-700/30'
                  : 'bg-gradient-to-br from-white to-amber-50 text-gray-900 border border-amber-200 shadow-lg'
              }`}
            >
              {/* Emotion Display */}
              {message.emotion && (
                <div className="mb-4 flex items-center gap-3 p-3 rounded-lg bg-black/10">
                  <span className="text-3xl">{message.emotion.emoji}</span>
                  <div>
                    <p className="font-semibold capitalize">
                      {message.emotion.label}
                    </p>
                    <p className="text-sm opacity-75">
                      Confidence: {Math.round(message.emotion.confidence * 100)}%
                    </p>
                  </div>
                </div>
              )}
              
              {/* Verses Display */}
              {message.verses && message.verses.length > 0 && (
                <div className="mb-4 space-y-3">
                  {message.verses.map((verse, index) => (
                    <div 
                      key={verse.id || index}
                      className={`p-4 rounded-lg border-l-4 ${
                        darkMode 
                          ? 'bg-amber-900/30 border-amber-500' 
                          : 'bg-amber-50 border-orange-500'
                      }`}
                    >
                      <p className="text-sm font-semibold text-orange-600 mb-2">
                        Chapter {verse.chapter}, Verse {verse.verse}
                        {verse.similarity_score && (
                          <span className="ml-2 text-xs opacity-75">
                            (Relevance: {Math.round(verse.similarity_score * 100)}%)
                          </span>
                        )}
                      </p>
                      <p className="font-serif text-lg mb-2 leading-relaxed">
                        {verse.shloka}
                      </p>
                      {verse.transliteration && (
                        <p className="text-sm italic mb-2 opacity-90">
                          {verse.transliteration}
                        </p>
                      )}
                      <p className="text-sm font-medium">
                        {verse.eng_meaning}
                      </p>
                      {verse.hin_meaning && (
                        <p className="text-sm mt-2 opacity-90">
                          {verse.hin_meaning}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Message Content */}
              <div className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </div>

              {/* Fallback Indicator */}
              {message.fallbackUsed && (
                <div className="mt-3 text-xs opacity-75 italic">
                  ⚠️ Some services used fallback mechanisms
                </div>
              )}

              {/* Timestamp */}
              <div className="mt-3 text-xs opacity-60">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-slate-800 border border-amber-700/30' : 'bg-gray-100 border border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <div className={darkMode ? 'text-amber-200' : 'text-gray-600'}>
                  <p className="text-sm font-medium">Processing your message...</p>
                  <p className="text-xs opacity-75">
                    Analyzing emotions → Finding verses → Generating reflection
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${
        darkMode ? 'border-amber-700/30 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind... (Press Enter to send, Shift+Enter for new line)"
            className={`flex-1 px-4 py-3 rounded-lg resize-none ${
              darkMode
                ? 'bg-slate-700 text-amber-100 border-amber-600 placeholder-amber-300'
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
            } border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            disabled={loading || !token}
            rows={input.includes('\n') ? Math.min(input.split('\n').length, 4) : 1}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || !token}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Send
          </button>
        </div>
        
        {!token && (
          <p className="text-sm text-red-600 mt-2">
            Please sign in to start chatting
          </p>
        )}
        
        <div className={`mt-2 text-xs ${
          darkMode ? 'text-amber-300' : 'text-gray-500'
        }`}>
          <p>
            🧠 Powered by RoBERTa emotion detection → ChromaDB verse search → Gemini reflection generation
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;