import React, { useState, useEffect } from 'react'
import { Briefcase, Plus, Edit2, Trash2, Check, X, Clock, DollarSign, User, Calendar } from 'lucide-react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const ProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    // TODO: Replace with actual API call
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          lead_name: 'PT Global Tech Solutions',
          sales_person: 'Ahmad Susanto',
          total_value: 15000000,
          status: 'waiting_approval',
          created_at: '2024-08-15T10:30:00Z',
          approval_needed: true,
          items: [
            {
              id: '1',
              product_name: 'Internet 100Mbps',
              original_price: 1500000,
              negotiated_price: 1200000,
              quantity: 1,
              needs_approval: true
            },
            {
              id: '2',
              product_name: 'Dedicated Server',
              original_price: 5000000,
              negotiated_price: 4500000,
              quantity: 1,
              needs_approval: true
            }
          ]
        },
        {
          id: '2',
          lead_name: 'CV Maju Sejahtera',
          sales_person: 'Siti Nurhaliza',
          total_value: 2400000,
          status: 'approved',
          created_at: '2024-08-20T14:15:00Z',
          approval_needed: false,
          items: [
            {
              id: '3',
              product_name: 'Internet 50Mbps',
              original_price: 800000,
              negotiated_price: 800000,
              quantity: 3,
              needs_approval: false
            }
          ]
        },
        {
          id: '3',
          lead_name: 'PT Inovasi Digital',
          sales_person: 'Budi Hartono',
          total_value: 8000000,
          status: 'rejected',
          created_at: '2024-08-10T09:45:00Z',
          approval_needed: false,
          rejection_reason: 'Budget constraints from customer side',
          items: [
            {
              id: '4',
              product_name: 'Enterprise Package',
              original_price: 8000000,
              negotiated_price: 6000000,
              quantity: 1,
              needs_approval: true
            }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting_approval':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting_approval':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <Check className="h-4 w-4" />
      case 'rejected':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredProjects = selectedStatus === 'all'
    ? projects
    : projects.filter(project => project.status === selectedStatus)

  const statusCounts = {
    all: projects.length,
    waiting_approval: projects.filter(p => p.status === 'waiting_approval').length,
    approved: projects.filter(p => p.status === 'approved').length,
    rejected: projects.filter(p => p.status === 'rejected').length,
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-indigo-600" />
            Deal Pipeline
          </h1>
          <p className="mt-2 text-gray-600">Manage project negotiations and approvals</p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Projects', count: statusCounts.all },
                { key: 'waiting_approval', label: 'Waiting Approval', count: statusCounts.waiting_approval },
                { key: 'approved', label: 'Approved', count: statusCounts.approved },
                { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedStatus === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      selectedStatus === tab.key
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" text="Loading projects..." />
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Projects ({filteredProjects.length})
                </h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </button>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg">No projects found</p>
                <p className="text-sm">
                  {selectedStatus === 'all'
                    ? 'Start by creating your first project'
                    : `No projects with status: ${selectedStatus.replace('_', ' ')}`
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.lead_name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1 capitalize">
                              {project.status.replace('_', ' ')}
                            </span>
                          </span>
                          {project.approval_needed && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                              Needs Approval
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Sales: {project.sales_person}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Created: {formatDate(project.created_at)}
                          </div>
                          <div className="flex items-center font-medium text-green-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Total: {formatPrice(project.total_value)}
                          </div>
                        </div>

                        {project.rejection_reason && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-700">
                              <strong>Rejection Reason:</strong> {project.rejection_reason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {project.status === 'waiting_approval' && (
                          <>
                            <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-md transition duration-200">
                              <Check className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200">
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition duration-200">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Project Items */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Project Items ({project.items.length})
                      </h4>

                      <div className="space-y-2">
                        {project.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">
                                  {item.product_name}
                                </span>
                                {item.needs_approval && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Below selling price
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                              {item.original_price !== item.negotiated_price && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Original: {formatPrice(item.original_price)} →
                                  Negotiated: {formatPrice(item.negotiated_price)}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {formatPrice(item.negotiated_price * item.quantity)}
                              </div>
                              {item.original_price !== item.negotiated_price && (
                                <div className="text-xs text-red-600">
                                  -{formatPrice((item.original_price - item.negotiated_price) * item.quantity)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ProjectsPage
