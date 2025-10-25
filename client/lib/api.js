/**
 * API utility functions for GitaGPT client
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Get Firebase auth token from current user
 */
async function getAuthToken() {
  try {
    // This assumes you have Firebase initialized in your app
    // You'll need to import and use your Firebase auth instance
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return null; // Return null instead of throwing for optional auth
    }
    
    return await user.getIdToken();
  } catch (error) {
    console.warn('Failed to get auth token:', error);
    return null;
  }
}

/**
 * Send a chat message to the backend
 * 
 * @param {string} userInput - The user's message
 * @param {string} sessionId - Optional session ID for continuing conversation
 * @param {string} interactionMode - One of 'wisdom', 'socratic', 'story'
 * @returns {Promise<Object>} Chat response with reflection, emotion, verses, etc.
 */
export async function sendChatMessage(userInput, sessionId = null, interactionMode = 'wisdom') {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/chat/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_input: userInput,
        session_id: sessionId,
        interaction_mode: interactionMode
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send message');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

/**
 * Create a new conversation session
 * 
 * @param {string} interactionMode - One of 'wisdom', 'socratic', 'story'
 * @returns {Promise<Object>} Session object with id and metadata
 */
export async function createSession(interactionMode = 'wisdom') {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/conversations/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        interaction_mode: interactionMode
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Get conversation context for a session
 * 
 * @param {string} sessionId - Session UUID
 * @param {number} windowSize - Number of recent messages to retrieve
 * @returns {Promise<Object>} Context object with messages
 */
export async function getConversationContext(sessionId, windowSize = 10) {
  try {
    const token = await getAuthToken();
    
    const url = new URL(`${API_URL}/conversations/${sessionId}/context`);
    if (windowSize) {
      url.searchParams.append('window_size', windowSize);
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get context');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting conversation context:', error);
    throw error;
  }
}

/**
 * End a conversation session
 * 
 * @param {string} sessionId - Session UUID
 * @param {string} summary - Optional summary of the conversation
 * @returns {Promise<Object>} Updated session object
 */
export async function endSession(sessionId, summary = null) {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/conversations/${sessionId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        summary
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to end session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error ending session:', error);
    throw error;
  }
}

/**
 * Get a random verse from the Bhagavad Gita
 * 
 * @returns {Promise<Object>} Random verse with Sanskrit, transliteration, and English meaning
 */
export async function getRandomVerse() {
  try {
    const response = await fetch(`${API_URL}/verses/random`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch random verse');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching random verse:', error);
    throw error;
  }
}

/**
 * Search for verses based on query
 * 
 * @param {string} query - Search query
 * @param {string} emotion - Optional emotion for re-ranking
 * @param {number} topK - Number of results to return
 * @returns {Promise<Object>} Search results with verses
 */
export async function searchVerses(query, emotion = null, topK = 5) {
  try {
    const response = await fetch(`${API_URL}/verses/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        emotion,
        top_k: topK
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to search verses');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching verses:', error);
    throw error;
  }
}

/**
 * Check API health
 * 
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/chat/health`);
    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    return { status: 'unhealthy', error: error.message };
  }
}
