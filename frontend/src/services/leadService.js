import { apiClient } from './apiClient'

export const leadService = {
  // Get all leads
  getAllLeads: async () => {
    try {
      const response = await apiClient.get('/leads')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch leads'
      }
    }
  },

  // Get lead by ID
  getLeadById: async (id) => {
    try {
      const response = await apiClient.get(`/leads/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch lead'
      }
    }
  },

  // Create new lead
  createLead: async (leadData) => {
    try {
      const response = await apiClient.post('/leads', leadData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create lead'
      }
    }
  },

  // Update lead
  updateLead: async (id, leadData) => {
    try {
      const response = await apiClient.put(`/leads/${id}`, leadData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update lead'
      }
    }
  },

  // Delete lead
  deleteLead: async (id) => {
    try {
      await apiClient.delete(`/leads/${id}`)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete lead'
      }
    }
  },

  // Update lead status
  updateLeadStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/leads/${id}/status`, { status })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update lead status'
      }
    }
  },

  // Convert lead to customer
  convertToCustomer: async (id, customerData) => {
    try {
      const response = await apiClient.post(`/leads/${id}/convert`, customerData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to convert lead'
      }
    }
  }
}
