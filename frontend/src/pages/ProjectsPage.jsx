// import React, { useState, useEffect } from 'react'
import React, { useState, useEffect } from 'react'
import { Briefcase, Plus, Edit2, Trash2, Check, X, Clock, DollarSign, User, Calendar } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { dealService } from '../services/dealService'

const ProjectsPage = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    setLoading(true)
    try {
      const result = await dealService.getDeals()
      if (result.success) {
        setDeals(result.data.data || result.data)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load deals. Please try again.')
    } finally {
      setLoading(false)
    }
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

  const filteredDeals = selectedStatus === 'all'
    ? deals
    : deals.filter(deal => deal.status === selectedStatus)

  const statusCounts = {
    all: deals.length,
    waiting_approval: deals.filter(d => d.status === 'waiting_approval').length,
    approved: deals.filter(d => d.status === 'approved').length,
    rejected: deals.filter(d => d.status === 'rejected').length,
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Briefcase className="h-8 w-8 mr-3 text-indigo-600" />
          Deal Pipeline
        </h1>
        <p className="mt-2 text-gray-600">Manage deal negotiations and approvals</p>
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
                { key: 'all', label: 'All Deals', count: statusCounts.all },
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
                  Deals ({filteredDeals.length})
                </h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Deal
                </button>
              </div>
            </div>

            {filteredDeals.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg">No deals found</p>
                <p className="text-sm">
                  {selectedStatus === 'all'
                    ? 'Start by creating your first deal'
                    : `No deals with status: ${selectedStatus.replace('_', ' ')}`
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDeals.map((deal) => (
                  <div key={deal.id} className="p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {deal.title || deal.deal_number}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                            {getStatusIcon(deal.status)}
                            <span className="ml-1 capitalize">
                              {deal.status.replace('_', ' ')}
                            </span>
                          </span>
                          {deal.needs_approval && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                              Needs Approval
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Sales: {deal.sales?.name || 'Unknown'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Created: {formatDate(deal.created_at)}
                          </div>
                          <div className="flex items-center font-medium text-green-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Total: {formatPrice(deal.final_amount || deal.total_amount)}
                          </div>
                        </div>

                        {deal.rejection_reason && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-700">
                              <strong>Rejection Reason:</strong> {deal.rejection_reason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {deal.status === 'waiting_approval' && (
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

                    {/* Deal Items */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Deal Items ({deal.items?.length || 0})
                      </h4>

                      <div className="space-y-2">
                        {(deal.items || []).map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">
                                  {item.product?.name || 'Unknown Product'}
                                </span>
                                {item.discount_percentage > 0 && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    {item.discount_percentage}% discount
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                              {item.unit_price !== item.negotiated_price && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Original: {formatPrice(item.unit_price)} →
                                  Negotiated: {formatPrice(item.negotiated_price)}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {formatPrice(item.subtotal)}
                              </div>
                              {item.unit_price !== item.negotiated_price && (
                                <div className="text-xs text-red-600">
                                  -{formatPrice((item.unit_price - item.negotiated_price) * item.quantity)}
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
  )
}

export default ProjectsPage
