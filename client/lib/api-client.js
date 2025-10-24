/**
 * API Client for GeetaManthan+ Backend
 * Handles all HTTP requests with authentication and error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Make authenticated request to backend
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options
   * @param {string} token - Firebase ID token
   * @returns {Promise<object>} Response data
   */
  async request(endpoint, options = {}, token = null) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const error = await response.json();
          errorMessage = error.detail || error.message || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`API Response: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get(endpoint, token = null) {
    return this.request(endpoint, { method: 'GET' }, token);
  }

  async post(endpoint, data, token = null) {
    return this.request(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  }

  async put(endpoint, data, token = null) {
    return this.request(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  }

  async delete(endpoint, token = null) {
    return this.request(endpoint, { method: 'DELETE' }, token);
  }
}

export const apiClient = new APIClient();