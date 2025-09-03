import apiClient from './apiClient';

const leadsService = {
  // Get all leads with pagination and filters
  getLeads: async (params = {}) => {
    const { data } = await apiClient.get('/leads', { params });
    return data;
  },

  // Get single lead by ID
  getLead: async (id) => {
    const { data } = await apiClient.get(`/leads/${id}`);
    return data;
  },

  // Create new lead
  createLead: async (leadData) => {
    const { data } = await apiClient.post('/leads', leadData);
    return data;
  },

  // Update existing lead
  updateLead: async (id, leadData) => {
    const { data } = await apiClient.put(`/leads/${id}`, leadData);
    return data;
  },

  // Delete lead
  deleteLead: async (id) => {
    const { data } = await apiClient.delete(`/leads/${id}`);
    return data;
  },

  // Convert lead to deal
  convertToDeal: async (id, dealData) => {
    const { data } = await apiClient.post(`/leads/${id}/convert-to-deal`, dealData);
    return data;
  },

  // Get lead statistics
  getLeadStats: async () => {
    const { data } = await apiClient.get('/leads/stats');
    return data;
  },
};

export default leadsService;
