import { apiClient } from './apiClient'

export const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data

      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { success: true, data: { token, user } }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/user')
      return { success: true, data: response.data.user }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user'
      }
    }
  },

  getStoredToken() {
    return localStorage.getItem('token')
  },

  getStoredUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!this.getStoredToken()
  }
}

export default authService
