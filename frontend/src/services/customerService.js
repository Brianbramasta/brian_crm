import { apiClient } from './apiClient'

export const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      const response = await apiClient.get('/customers')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch customers'
      }
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await apiClient.get(`/customers/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch customer'
      }
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await apiClient.post('/customers', customerData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create customer'
      }
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await apiClient.put(`/customers/${id}`, customerData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update customer'
      }
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      await apiClient.delete(`/customers/${id}`)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete customer'
      }
    }
  },

  // Get customer services
  getCustomerServices: async (customerId) => {
    try {
      const response = await apiClient.get(`/customers/${customerId}/services`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch customer services'
      }
    }
  },

  // Add service to customer
  addCustomerService: async (customerId, serviceData) => {
    try {
      const response = await apiClient.post(`/customers/${customerId}/services`, serviceData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add customer service'
      }
    }
  }
}
