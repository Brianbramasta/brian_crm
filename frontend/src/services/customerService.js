import apiClient from './apiClient';

export const customerService = {
  // Get all customers with optional filters
  async getCustomers(params = {}) {
    try {
      const response = await apiClient.get('/customers', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single customer by ID
  async getCustomer(id) {
    try {
      const response = await apiClient.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new customer
  async createCustomer(customerData) {
    try {
      const response = await apiClient.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing customer
  async updateCustomer(id, customerData) {
    try {
      const response = await apiClient.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  async deleteCustomer(id) {
    try {
      const response = await apiClient.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search customers
  async searchCustomers(query) {
    try {
      const response = await apiClient.get('/customers/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer statistics
  async getCustomerStats() {
    try {
      const response = await apiClient.get('/customers/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export customers
  async exportCustomers(format = 'csv', filters = {}) {
    try {
      const response = await apiClient.get('/customers/export', {
        params: { format, ...filters },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Import customers
  async importCustomers(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/customers/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
