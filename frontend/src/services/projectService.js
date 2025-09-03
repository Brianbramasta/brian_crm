import { apiClient } from './apiClient'

export const projectService = {
  // Get all projects/deals
  getAllProjects: async () => {
    try {
      const response = await apiClient.get('/projects')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch projects'
      }
    }
  },

  // Get project by ID
  getProjectById: async (id) => {
    try {
      const response = await apiClient.get(`/projects/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch project'
      }
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await apiClient.post('/projects', projectData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create project'
      }
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const response = await apiClient.put(`/projects/${id}`, projectData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update project'
      }
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      await apiClient.delete(`/projects/${id}`)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete project'
      }
    }
  },

  // Approve project
  approveProject: async (id, approvalData = {}) => {
    try {
      const response = await apiClient.post(`/projects/${id}/approve`, approvalData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to approve project'
      }
    }
  },

  // Reject project
  rejectProject: async (id, rejectionData) => {
    try {
      const response = await apiClient.post(`/projects/${id}/reject`, rejectionData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reject project'
      }
    }
  },

  // Get project items
  getProjectItems: async (projectId) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}/items`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch project items'
      }
    }
  },

  // Add item to project
  addProjectItem: async (projectId, itemData) => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/items`, itemData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add project item'
      }
    }
  },

  // Update project item
  updateProjectItem: async (projectId, itemId, itemData) => {
    try {
      const response = await apiClient.put(`/projects/${projectId}/items/${itemId}`, itemData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update project item'
      }
    }
  },

  // Remove item from project
  removeProjectItem: async (projectId, itemId) => {
    try {
      await apiClient.delete(`/projects/${projectId}/items/${itemId}`)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove project item'
      }
    }
  }
}
