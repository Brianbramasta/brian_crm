import React, { useState, useEffect } from 'react'
import { Users, Plus, Edit2, Trash2, Phone, MapPin, Mail, Calendar, Activity, X, Save } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { leadService } from '../services/leadService'
import { useAuth } from '../contexts/AuthContext'

const LeadsPage = () => {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    needs: '',
    source: '',
    notes: '',
    status: 'new'
  })

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const result = await leadService.getAllLeads()
      if (result.success) {
        setLeads(result.data.data || result.data)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load leads. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingLead(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      needs: '',
      source: '',
      notes: '',
      status: 'new'
    })
    setShowModal(true)
  }

  const openEditModal = (lead) => {
    setEditingLead(lead)
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      address: lead.address || '',
      needs: lead.needs || '',
      source: lead.source || '',
      notes: lead.notes || '',
      status: lead.status || 'new'
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result
      if (editingLead) {
        result = await leadService.updateLead(editingLead.id, formData)
      } else {
        result = await leadService.createLead(formData)
      }

      if (result.success) {
        await loadLeads()
        setShowModal(false)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to save lead. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return

    try {
      const result = await leadService.deleteLead(leadId)
      if (result.success) {
        await loadLeads()
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to delete lead. Please try again.')
    }
  }

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      const result = await leadService.updateLeadStatus(leadId, newStatus)
      if (result.success) {
        await loadLeads()
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to update lead status. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'proposal':
        return 'bg-purple-100 text-purple-800'
      case 'negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'closed_won':
        return 'bg-green-200 text-green-900'
      case 'closed_lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatPrice = (price) => {
    if (!price) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredLeads = selectedStatus === 'all'
    ? leads
    : leads.filter(lead => lead.status === selectedStatus)

  const statusCounts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    closed_won: leads.filter(l => l.status === 'closed_won').length,
    closed_lost: leads.filter(l => l.status === 'closed_lost').length,
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="h-8 w-8 mr-3 text-indigo-600" />
          Lead Management
        </h1>
        <p className="mt-2 text-gray-600">Manage ISP service prospects and potential customers</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Leads', count: statusCounts.all },
              { key: 'new', label: 'New', count: statusCounts.new },
              { key: 'contacted', label: 'Contacted', count: statusCounts.contacted },
              { key: 'qualified', label: 'Qualified', count: statusCounts.qualified },
              { key: 'closed_won', label: 'Won', count: statusCounts.closed_won },
              { key: 'closed_lost', label: 'Lost', count: statusCounts.closed_lost },
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
            <LoadingSpinner size="lg" text="Loading leads..." />
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Leads ({filteredLeads.length})
                  </h2>
                  <p className="text-sm text-gray-600">
                    {user?.role === 'manager' ? 'All team leads' : 'Your assigned leads'}
                  </p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Lead
                </button>
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg">No leads found</p>
                <p className="text-sm">
                  {selectedStatus === 'all'
                    ? 'Start by adding your first potential customer'
                    : `No leads with status: ${selectedStatus.replace('_', ' ')}`
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {lead.name}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('_', ' ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          {lead.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {lead.email}
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {lead.phone}
                            </div>
                          )}
                          {lead.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {lead.address}
                            </div>
                          )}
                        </div>

                        {lead.needs && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Requirements:</span> {lead.needs}
                            </p>
                          </div>
                        )}

                        {lead.notes && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Notes:</span> {lead.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              Sales: {lead.sales?.name || 'Unassigned'}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Created: {formatDate(lead.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {/* Status Update Dropdown */}
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="closed_won">Won</option>
                          <option value="closed_lost">Lost</option>
                        </select>
                        <button
                          onClick={() => openEditModal(lead)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition duration-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingLead ? 'Edit Lead' : 'Create New Lead'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Needs/Requirements</label>
                  <textarea
                    value={formData.needs}
                    onChange={(e) => setFormData({...formData, needs: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select source...</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="cold_call">Cold Call</option>
                    <option value="social_media">Social Media</option>
                    <option value="event">Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed_won">Won</option>
                    <option value="closed_lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : (editingLead ? 'Update' : 'Create')}
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

export default LeadsPage
