import apiClient from './apiClient';

export const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, we should clear local storage
      console.error('Logout error:', error);
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, email, password, passwordConfirmation) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
