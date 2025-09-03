import apiClient from './apiClient';

const dealsService = {
  // Get all deals with pagination and filters
  getDeals: async (params = {}) => {
    const { data } = await apiClient.get('/deals', { params });
    return data;
  },

  // Get single deal by ID
  getDeal: async (id) => {
    const { data } = await apiClient.get(`/deals/${id}`);
    return data;
  },

  // Create new deal from lead
  createDeal: async (dealData) => {
    const { data } = await apiClient.post('/deals', dealData);
    return data;
  },

  // Update existing deal
  updateDeal: async (id, dealData) => {
    const { data } = await apiClient.put(`/deals/${id}`, dealData);
    return data;
  },

  // Delete deal
  deleteDeal: async (id) => {
    const { data } = await apiClient.delete(`/deals/${id}`);
    return data;
  },

  // Approve deal (manager only)
  approveDeal: async (id) => {
    const { data } = await apiClient.post(`/deals/${id}/approve`);
    return data;
  },

  // Reject deal (manager only)
  rejectDeal: async (id) => {
    const { data } = await apiClient.post(`/deals/${id}/reject`);
    return data;
  },

  // Add item to deal
  addDealItem: async (dealId, itemData) => {
    const { data } = await apiClient.post(`/deals/${dealId}/items`, itemData);
    return data;
  },

  // Update deal item
  updateDealItem: async (dealId, itemId, itemData) => {
    const { data } = await apiClient.put(`/deals/${dealId}/items/${itemId}`, itemData);
    return data;
  },

  // Remove item from deal
  removeDealItem: async (dealId, itemId) => {
    const { data } = await apiClient.delete(`/deals/${dealId}/items/${itemId}`);
    return data;
  },

  // Get deal statistics
  getDealStats: async () => {
    const { data } = await apiClient.get('/deals/stats');
    return data;
  },
};

export default dealsService;
