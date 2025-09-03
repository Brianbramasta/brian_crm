import apiClient from './apiClient';

const productsService = {
  // Get all products with pagination and filters
  getProducts: async (params = {}) => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  // Get single product by ID
  getProduct: async (id) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  // Create new product
  createProduct: async (productData) => {
    const { data } = await apiClient.post('/products', productData);
    return data;
  },

  // Update existing product
  updateProduct: async (id, productData) => {
    const { data } = await apiClient.put(`/products/${id}`, productData);
    return data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },

  // Calculate selling price
  calculateSellingPrice: async (hpp, marginPercent) => {
    const { data } = await apiClient.post('/products/calculate-price', {
      hpp,
      margin_percent: marginPercent,
    });
    return data;
  },
};

export default productsService;