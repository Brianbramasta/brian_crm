import React, { useState, useEffect } from 'react'
import { Briefcase, Plus, Edit2, Trash2, Check, X, Clock, DollarSign, User, Calendar, Save, ShoppingCart } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { dealService } from '../services/dealService'
import { productService } from '../services/productService'
import { leadService } from '../services/leadService'
import { useAuth } from '../contexts/AuthContext'

const ProjectsPage = () => {
  const { user } = useAuth()
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [products, setProducts] = useState([])
  const [leads, setLeads] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    lead_id: '',
    notes: '',
    status: 'waiting_approval'
  })
  const [dealItems, setDealItems] = useState([{
    product_id: '',
    quantity: 1,
    unit_price: 0,
    negotiated_price: 0,
    discount_percentage: 0
  }])

  useEffect(() => {
    loadDeals()
    loadProducts()
    loadLeads()
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

  const loadProducts = async () => {
    try {
      const result = await productService.getAllProducts()
      if (result.success) {
        setProducts(result.data.data || result.data)
      }
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  }

  const loadLeads = async () => {
    try {
      const result = await leadService.getAllLeads()
      if (result.success) {
        // Filter only leads that haven't been converted to deals yet
        const availableLeads = (result.data.data || result.data).filter(lead =>
          lead.status === 'qualified' || lead.status === 'new' || lead.status === 'contacted'
        )
        setLeads(availableLeads)
      }
    } catch (err) {
      console.error('Failed to load leads:', err)
    }
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

  const openCreateModal = () => {
    setEditingDeal(null)
    setFormData({
      title: '',
      lead_id: '',
      notes: '',
      status: 'waiting_approval'
    })
    setDealItems([{
      product_id: '',
      quantity: 1,
      unit_price: 0,
      negotiated_price: 0,
      discount_percentage: 0
    }])
    setShowModal(true)
  }

  const openEditModal = (deal) => {
    setEditingDeal(deal)
    setFormData({
      title: deal.title || '',
      lead_id: deal.lead_id || '',
      notes: deal.notes || '',
      status: deal.status || 'waiting_approval'
    })
    setDealItems(deal.items?.map(item => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price),
      negotiated_price: parseFloat(item.negotiated_price),
      discount_percentage: parseFloat(item.discount_percentage || 0)
    })) || [{
      product_id: '',
      quantity: 1,
      unit_price: 0,
      negotiated_price: 0,
      discount_percentage: 0
    }])
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dealData = {
        ...formData,
        items: dealItems.filter(item => item.product_id && item.quantity > 0)
      }

      let result
      if (editingDeal) {
        result = await dealService.updateDeal(editingDeal.id, dealData)
      } else {
        result = await dealService.createDeal(dealData)
      }

      if (result.success) {
        await loadDeals()
        setShowModal(false)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to save deal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return

    try {
      const result = await dealService.deleteDeal(dealId)
      if (result.success) {
        await loadDeals()
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to delete deal. Please try again.')
    }
  }

  const handleApprove = async (dealId) => {
    try {
      const result = await dealService.approveDeal(dealId, { approved: true })
      if (result.success) {
        await loadDeals()
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to approve deal. Please try again.')
    }
  }

  const handleReject = async (dealId) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    try {
      const result = await dealService.approveDeal(dealId, {
        approved: false,
        notes: reason
      })
      if (result.success) {
        await loadDeals()
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to reject deal. Please try again.')
    }
  }

  const addDealItem = () => {
    setDealItems([...dealItems, {
      product_id: '',
      quantity: 1,
      unit_price: 0,
      negotiated_price: 0,
      discount_percentage: 0
    }])
  }

  const removeDealItem = (index) => {
    if (dealItems.length > 1) {
      setDealItems(dealItems.filter((_, i) => i !== index))
    }
  }

  const updateDealItem = (index, field, value) => {
    const updatedItems = [...dealItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Auto-calculate negotiated price based on discount
    if (field === 'product_id') {
      const product = products.find(p => p.id === value)
      if (product) {
        updatedItems[index].unit_price = parseFloat(product.selling_price)
        updatedItems[index].negotiated_price = parseFloat(product.selling_price)
        updatedItems[index].discount_percentage = 0
      }
    } else if (field === 'unit_price' || field === 'discount_percentage') {
      const unitPrice = parseFloat(updatedItems[index].unit_price) || 0
      const discount = parseFloat(updatedItems[index].discount_percentage) || 0
      updatedItems[index].negotiated_price = unitPrice * (1 - discount / 100)
    }

    setDealItems(updatedItems)
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
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
                >
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
                        {deal.status === 'waiting_approval' && user?.role === 'manager' && (
                          <>
                            <button
                              onClick={() => handleApprove(deal.id)}
                              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-md transition duration-200"
                              title="Approve Deal"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(deal.id)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200"
                              title="Reject Deal"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditModal(deal)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition duration-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {user?.role === 'manager' && (
                          <button
                            onClick={() => handleDelete(deal.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
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

        {/* Add/Edit Deal Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingDeal ? 'Edit Deal' : 'Create New Deal'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Deal Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deal Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter deal title (e.g., Internet Package Deal for ABC Corp)"
                      required
                    />
                  </div>

                  {/* Lead Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lead/Customer</label>
                    <select
                      value={formData.lead_id}
                      onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a lead</option>
                      {leads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name} - {lead.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Deal Items */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">Deal Items</label>
                      <button
                        type="button"
                        onClick={addDealItem}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </button>
                    </div>

                    <div className="space-y-3">
                      {dealItems.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700">Product</label>
                              <select
                                value={item.product_id}
                                onChange={(e) => updateDealItem(index, 'product_id', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              >
                                <option value="">Select product</option>
                                {products.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name} - {formatPrice(product.selling_price)}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700">Quantity</label>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateDealItem(index, 'quantity', parseInt(e.target.value))}
                                min="1"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700">Unit Price</label>
                              <input
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => updateDealItem(index, 'unit_price', parseFloat(e.target.value))}
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700">Discount %</label>
                              <input
                                type="number"
                                value={item.discount_percentage}
                                onChange={(e) => updateDealItem(index, 'discount_percentage', parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700">Negotiated Price</label>
                              <input
                                type="number"
                                value={item.negotiated_price}
                                onChange={(e) => updateDealItem(index, 'negotiated_price', parseFloat(e.target.value))}
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>

                            <div className="flex items-end">
                              {dealItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeDealItem(index)}
                                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Subtotal Display */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-700">
                                Subtotal: {formatPrice(item.negotiated_price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Additional notes for this deal..."
                    />
                  </div>

                  {/* Total Display */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total Deal Value:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatPrice(dealItems.reduce((total, item) => total + (item.negotiated_price * item.quantity), 0))}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingDeal ? 'Update Deal' : 'Create Deal'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default ProjectsPage
