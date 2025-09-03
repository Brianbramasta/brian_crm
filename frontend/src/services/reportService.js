import { apiClient } from './apiClient'

export const reportService = {
  // Get dashboard statistics
  getDashboardStats: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/reports/dashboard-stats?period=${period}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard statistics'
      }
    }
  },

  // Generate sales report
  generateSalesReport: async (dateRange) => {
    try {
      const response = await apiClient.post('/reports/sales', dateRange)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate sales report'
      }
    }
  },

  // Generate revenue report
  generateRevenueReport: async (dateRange) => {
    try {
      const response = await apiClient.post('/reports/revenue', dateRange)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate revenue report'
      }
    }
  },

  // Generate customer report
  generateCustomerReport: async (dateRange) => {
    try {
      const response = await apiClient.post('/reports/customers', dateRange)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate customer report'
      }
    }
  },

  // Get lead conversion analytics
  getLeadConversionStats: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/reports/lead-conversion?period=${period}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch lead conversion statistics'
      }
    }
  },

  // Get sales performance by user
  getSalesPerformance: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/reports/sales-performance?period=${period}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch sales performance data'
      }
    }
  },

  // Get product performance
  getProductPerformance: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/reports/product-performance?period=${period}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product performance data'
      }
    }
  },

  // Download report as Excel
  downloadReport: async (reportType, reportId) => {
    try {
      const response = await apiClient.get(`/reports/${reportType}/${reportId}/download`, {
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${reportType}-report-${new Date().getTime()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to download report'
      }
    }
  },

  // Get all generated reports
  getAllReports: async () => {
    try {
      const response = await apiClient.get('/reports')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch reports'
      }
    }
  },

  // Delete report
  deleteReport: async (reportId) => {
    try {
      await apiClient.delete(`/reports/${reportId}`)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete report'
      }
    }
  }
}
