import { apiClient } from './apiClient'

export const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })

      const { token, user, permissions } = response.data

      // Store token, user data, and permissions
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ ...user, permissions }))

      return { success: true, data: { token, user: { ...user, permissions } } }
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
      const { user, permissions, stats } = response.data

      // Update stored user data with latest info
      const userData = { ...user, permissions, stats }
      localStorage.setItem('user', JSON.stringify(userData))

      return { success: true, data: userData }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user'
      }
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/user/profile', profileData)
      const { user } = response.data

      // Update stored user data
      const storedUser = this.getStoredUser()
      const updatedUser = { ...storedUser, ...user }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return { success: true, data: updatedUser }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
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
  },

  hasPermission(permission) {
    const user = this.getStoredUser()
    return user?.permissions?.[permission] || false
  },

  isSales() {
    const user = this.getStoredUser()
    return user?.role === 'sales'
  },

  isManager() {
    const user = this.getStoredUser()
    return user?.role === 'manager'
  }
}

export default authService
