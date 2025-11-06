const API_URL = 'http://localhost:5000/api';

const api = {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    // Handle FormData (for file uploads)
    const isFormData = options.body instanceof FormData;
    const config = {
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && !isFormData) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = 'Something went wrong';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  async getProfile(token) {
    return this.request('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async updateProfile(userData) {
    try {
      const token = localStorage.getItem('token');
      const isFormData = userData instanceof FormData;
      
      const response = await this.request('/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: userData
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  async uploadProfileImage(formData) {
    try {
      const token = localStorage.getItem('token');
      const response = await this.request('/auth/upload-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default api;