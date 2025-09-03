import apiClient from './apiClient';

const reportingService = {
  // Generate report based on type and date range
  generateReport: async (reportType, startDate, endDate) => {
    const { data } = await apiClient.get(`/reports/${reportType}`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return data;
  },

  // Export report to Excel
  exportToExcel: async (reportType, startDate, endDate) => {
    const { data } = await apiClient.get(`/reports/${reportType}/export`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      responseType: 'blob',
    });
    return data;
  },
};

export default reportingService;
