const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers with auth token
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { includeAuth: false });
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      includeAuth: false,
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      includeAuth: false,
    });
  }

  async googleAuth(userData) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Mood entries
  async getMoodEntries() {
    return this.request('/mood-entries');
  }

  async getMoodStats() {
    return this.request('/mood-entries/stats');
  }

  async createMoodEntry(moodData) {
    return this.request('/mood-entries', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  // Meditations
  async getMeditations() {
    return this.request('/meditations');
  }

  async getFeaturedMeditations() {
    return this.request('/meditations/featured');
  }

  async createMeditationSession(sessionData) {
    return this.request('/meditations', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  // Community
  async getCommunityPosts() {
    return this.request('/community');
  }

  async createCommunityPost(postData) {
    return this.request('/community', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // AI Chat
  async sendChatMessage(message) {
    return this.request('/ai-chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getChatHistory() {
    return this.request('/ai-chat');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
