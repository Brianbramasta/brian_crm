import api from './api'

export const taskService = {
  async getAllTasks() {
    try {
      const response = await api.get('/tasks')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch tasks'
      }
    }
  },

  async createTask(title) {
    try {
      const response = await api.post('/tasks', { title })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create task'
      }
    }
  },

  async updateTask(id, data) {
    try {
      const response = await api.put(`/tasks/${id}`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update task'
      }
    }
  },

  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete task'
      }
    }
  }
}

export default taskService
