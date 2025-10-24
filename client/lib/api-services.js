import { apiClient } from './api-client';

/**
 * Authentication Services
 */
export const authService = {
  /**
   * Register user in backend after Firebase signup
   */
  async register(firebaseUser, token) {
    return apiClient.post('/api/auth/register', {
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email,
      display_name: firebaseUser.displayName || '',
    }, token);
  },

  /**
   * Login user and sync with backend
   */
  async login(firebaseUser, token) {
    return apiClient.post('/api/auth/login', {
      firebase_uid: firebaseUser.uid,
    }, token);
  },
};

/**
 * Chat Services - Main integration with your backend's complete flow
 */
export const chatService = {
  /**
   * Send message and get AI response with complete emotion->verse->reflection flow
   * This calls your backend's /api/chat endpoint which:
   * 1. Uses RoBERTa model for emotion detection
   * 2. Searches ChromaDB for semantically relevant verses
   * 3. Sends top 3 verses + emotion + input to Gemini
   * 4. Returns final verse recommendation with reflection
   */
  async sendMessage(message, sessionId, interactionMode, token) {
    const payload = {
      user_input: message,
      interaction_mode: interactionMode || 'wisdom',
    };

    // Add session_id if provided
    if (sessionId) {
      payload.session_id = sessionId;
    }

    return apiClient.post('/api/chat', payload, token);
  },

  /**
   * Check chat service health
   */
  async checkHealth(token) {
    return apiClient.get('/api/chat/health', token);
  },
};

/**
 * Conversation Services
 */
export const conversationService = {
  /**
   * Create new conversation session
   */
  async createSession(token) {
    return apiClient.post('/api/conversations/sessions', {}, token);
  },

  /**
   * Get conversation context
   */
  async getContext(sessionId, token) {
    return apiClient.get(`/api/conversations/${sessionId}/context`, token);
  },

  /**
   * End conversation session
   */
  async endSession(sessionId, token) {
    return apiClient.post(`/api/conversations/${sessionId}/end`, {}, token);
  },
};

/**
 * Verse Services
 */
export const verseService = {
  /**
   * Search for verses (direct semantic search)
   */
  async searchVerses(query, emotion, topK, token) {
    return apiClient.post('/api/verses/search', {
      query,
      emotion,
      top_k: topK || 5,
    }, token);
  },

  /**
   * Get daily inspirational verse
   */
  async getDailyVerse(token) {
    const queries = [
      'inner peace and wisdom',
      'strength and courage',
      'purpose and duty',
      'devotion and faith',
      'knowledge and understanding',
    ];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const result = await this.searchVerses(randomQuery, null, 1, token);
    return result.verses[0];
  },
};

/**
 * Mood Tracking Services
 */
export const moodService = {
  /**
   * Get mood data for date range
   */
  async getMoodData(startDate, endDate, token) {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });
    return apiClient.get(`/api/logs/mood?${params}`, token);
  },

  /**
   * Get mood data for specific month
   */
  async getMonthMoodData(year, month, token) {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    return this.getMoodData(startDate, endDate, token);
  },
};

/**
 * Analytics Services
 */
export const analyticsService = {
  /**
   * Get emotion statistics
   */
  async getStats(timeRange, token) {
    const params = new URLSearchParams({ time_range: timeRange });
    return apiClient.get(`/api/analytics/stats?${params}`, token);
  },

  /**
   * Get identified patterns
   */
  async getPatterns(timeRange, token) {
    const params = new URLSearchParams({ time_range: timeRange });
    return apiClient.get(`/api/analytics/patterns?${params}`, token);
  },
};