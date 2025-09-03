import React, { useState, useEffect } from 'react'
import { CheckCircle, Plus, Edit2, Trash2 } from 'lucide-react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { taskService } from '../services/taskService'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    const result = await taskService.getAllTasks()

    if (result.success) {
      setTasks(result.data)
      setError('')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    setIsAddingTask(true)
    const result = await taskService.createTask(newTaskTitle.trim())

    if (result.success) {
      setTasks([result.data, ...tasks])
      setNewTaskTitle('')
      setError('')
    } else {
      setError(result.error)
    }
    setIsAddingTask(false)
  }

  const handleToggleTask = async (task) => {
    const result = await taskService.updateTask(task.id, {
      isCompleted: !task.isCompleted
    })

    if (result.success) {
      setTasks(tasks.map(t =>
        t.id === task.id
          ? { ...t, isCompleted: result.data.isCompleted }
          : t
      ))
      setError('')
    } else {
      setError(result.error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    const result = await taskService.deleteTask(taskId)

    if (result.success) {
      setTasks(tasks.filter(t => t.id !== taskId))
      setError('')
    } else {
      setError(result.error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout>
      <div className=\"max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8\">
        <div className=\"mb-8\">
          <h1 className=\"text-3xl font-bold text-gray-900 flex items-center\">
            <CheckCircle className=\"h-8 w-8 mr-3 text-indigo-600\" />
            Task Management
          </h1>
          <p className=\"mt-2 text-gray-600\">Manage your tasks and stay organized</p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
            className=\"mb-6\"
          />
        )}

        {/* Add New Task Form */}
        <div className=\"bg-white shadow rounded-lg p-6 mb-6\">
          <form onSubmit={handleAddTask} className=\"flex gap-4\">
            <input
              type=\"text\"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder=\"Enter a new task...\"
              className=\"flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500\"
            />
            <button
              type=\"submit\"
              disabled={isAddingTask || !newTaskTitle.trim()}
              className=\"px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center\"
            >
              <Plus className=\"h-4 w-4 mr-2\" />
              {isAddingTask ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div className=\"bg-white shadow rounded-lg\">
          <div className=\"px-6 py-4 border-b border-gray-200\">
            <h2 className=\"text-lg font-medium text-gray-900\">
              Your Tasks ({tasks.length})
            </h2>
          </div>

          {loading ? (
            <div className=\"p-8 text-center\">
              <LoadingSpinner />
            </div>
          ) : tasks.length === 0 ? (
            <div className=\"p-8 text-center text-gray-500\">
              <CheckCircle className=\"h-12 w-12 mx-auto text-gray-300 mb-4\" />
              <p>No tasks yet. Create your first task above!</p>
            </div>
          ) : (
            <div className=\"divide-y divide-gray-200\">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-6 hover:bg-gray-50 transition duration-200 ${\n                    task.isCompleted ? 'opacity-75' : ''\n                  }`}\n                >\n                  <div className=\"flex items-center justify-between\">\n                    <div className=\"flex items-center space-x-3 flex-1\">\n                      <button\n                        onClick={() => handleToggleTask(task)}\n                        className={`h-5 w-5 rounded border-2 flex items-center justify-center transition duration-200 ${\n                          task.isCompleted\n                            ? 'bg-green-500 border-green-500'\n                            : 'border-gray-300 hover:border-indigo-500'\n                        }`}\n                      >\n                        {task.isCompleted && (\n                          <CheckCircle className=\"h-3 w-3 text-white\" />\n                        )}\n                      </button>\n                      \n                      <div className=\"flex-1\">\n                        <p\n                          className={`text-sm font-medium ${\n                            task.isCompleted\n                              ? 'line-through text-gray-500'\n                              : 'text-gray-900'\n                          }`}\n                        >\n                          {task.title}\n                        </p>\n                        <p className=\"text-xs text-gray-500 mt-1\">\n                          Created: {formatDate(task.createdAt)}\n                        </p>\n                      </div>\n                    </div>\n\n                    <div className=\"flex items-center space-x-2\">\n                      <button\n                        onClick={() => handleDeleteTask(task.id)}\n                        className=\"p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition duration-200\"\n                        title=\"Delete task\"\n                      >\n                        <Trash2 className=\"h-4 w-4\" />\n                      </button>\n                    </div>\n                  </div>\n                </div>\n              ))}\n            </div>\n          )}\n        </div>\n      </div>\n    </Layout>\n  )\n}\n\nexport default TasksPage
