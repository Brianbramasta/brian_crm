import { apiClient } from './apiClient'

export const dealService = {
  // Get all deals with filtering
  async getDeals(params = {}) {
    try {
      const response = await apiClient.get('/deals', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch deals'
      }
    }
  },

  // Get single deal
  async getDeal(id) {
    try {
      const response = await apiClient.get(`/deals/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch deal'
      }
    }
  },

  // Create new deal
  async createDeal(dealData) {
    try {
      const response = await apiClient.post('/deals', dealData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create deal'
      }
    }
  },

  // Update deal
  async updateDeal(id, dealData) {
    try {
      const response = await apiClient.put(`/deals/${id}`, dealData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update deal'
      }
    }
  },

  // Delete deal
  async deleteDeal(id) {
    try {
      await apiClient.delete(`/deals/${id}`)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete deal'
      }
    }
  },

  // Approve deal
  async approveDeal(id, approvalData = {}) {
    try {
      const response = await apiClient.post(`/deals/${id}/approve`, approvalData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to approve deal'
      }
    }
  },

  // Close deal (win or lose)
  async closeDeal(id, closeData) {
    try {
      const response = await apiClient.post(`/deals/${id}/close`, closeData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to close deal'
      }
    }
  },

  // Get deals statistics
  async getDealsStats() {
    try {
      const response = await apiClient.get('/deals-stats')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch deals statistics'
      }
    }
  },

  // Get deals needing approval (for managers)
  async getDealsNeedingApproval() {
    try {
      const response = await apiClient.get('/deals-approval')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch deals needing approval'
      }
    }
  },

  // Add item to deal
  async addDealItem(dealId, itemData) {
    try {
      const response = await apiClient.post(`/deals/${dealId}/items`, itemData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add deal item'
      }
    }
  },

  // Update deal item
  async updateDealItem(dealId, itemId, itemData) {
    try {
      const response = await apiClient.put(`/deals/${dealId}/items/${itemId}`, itemData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update deal item'
      }
    }
  },

  // Remove item from deal
  async removeDealItem(dealId, itemId) {
    try {
      await apiClient.delete(`/deals/${dealId}/items/${itemId}`)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove deal item'
      }
    }
  }
}

export default dealService
