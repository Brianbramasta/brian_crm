import React, { useState, useEffect } from 'react'
import { Users, Plus, Edit2, Trash2, Wifi, Calendar, Building, Phone, MapPin, X, Save, Eye, Settings } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { customerService } from '../services/customerService'
import { useAuth } from '../contexts/AuthContext'

const CustomersPage = () => {
  const { user } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerServices, setCustomerServices] = useState([])

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const result = await customerService.getAllCustomers()
      if (result.success) {
        setCustomers(result.data.data || result.data)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const viewCustomerServices = async (customer) => {
    setSelectedCustomer(customer)
    try {
      const result = await customerService.getCustomerServices(customer.id)
      if (result.success) {
        setCustomerServices(result.data)
        setShowServiceModal(true)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load customer services.')
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
      month: 'long',
      day: 'numeric',
    })
  }

  const getServiceStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800'
      case 'terminated':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'individual':
        return 'bg-blue-100 text-blue-800'
      case 'corporate':
        return 'bg-purple-100 text-purple-800'
      case 'government':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCustomers = selectedStatus === 'all'
    ? customers
    : customers.filter(customer => customer.status === selectedStatus)

  const statusCounts = {
    all: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    suspended: customers.filter(c => c.status === 'suspended').length,
    terminated: customers.filter(c => c.status === 'terminated').length,
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Building className="h-8 w-8 mr-3 text-indigo-600" />
          Active Customers
        </h1>
        <p className="mt-2 text-gray-600">Manage your active ISP customers and their services</p>
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
              { key: 'all', label: 'All Customers', count: statusCounts.all },
              { key: 'active', label: 'Active', count: statusCounts.active },
              { key: 'suspended', label: 'Suspended', count: statusCounts.suspended },
              { key: 'terminated', label: 'Terminated', count: statusCounts.terminated },
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
            <LoadingSpinner size="lg" text="Loading customers..." />
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Customer Database ({filteredCustomers.length} customers)
                  </h2>
                  <p className="text-sm text-gray-600">
                    {user?.role === 'manager' ? 'All customers' : 'Your assigned customers'}
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </button>
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg">No customers found</p>
                <p className="text-sm">
                  {selectedStatus === 'all'
                    ? 'Start by converting leads to customers'
                    : `No ${selectedStatus} customers found`
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {customer.name}
                          </h3>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getServiceStatusColor(customer.status || 'active')}`}>
                            {(customer.status || 'active').charAt(0).toUpperCase() + (customer.status || 'active').slice(1)}
                          </span>
                          {customer.customer_type && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTypeColor(customer.customer_type)}`}>
                              {customer.customer_type.charAt(0).toUpperCase() + customer.customer_type.slice(1)}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          {customer.email && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {customer.phone}
                            </div>
                          )}
                          {customer.billing_address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {customer.billing_address}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Customer since: {formatDate(customer.created_at)}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Sales: {customer.sales?.name || 'Unassigned'}
                          </div>
                          {customer.customer_number && (
                            <div className="flex items-center font-medium text-indigo-600">
                              ID: {customer.customer_number}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => viewCustomerServices(customer)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-md transition duration-200"
                          title="View Services"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition duration-200">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Services Overview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Wifi className="h-4 w-4 mr-2" />
                        Services Overview ({customer.services?.length || 0})
                      </h4>

                      {customer.services && customer.services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {customer.services.slice(0, 2).map((service) => (
                            <div key={service.id} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                              <span className="font-medium">{service.product_name || service.name}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getServiceStatusColor(service.status)}`}>
                                {service.status}
                              </span>
                            </div>
                          ))}
                          {customer.services.length > 2 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{customer.services.length - 2} more services
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No active services</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Service Details Modal */}
        {showServiceModal && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Services for {selectedCustomer.name}
                </h3>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {customerServices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Wifi className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No services found for this customer</p>
                  </div>
                ) : (
                  customerServices.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{service.product_name || service.name}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Service ID:</span>
                              <br />{service.service_number || service.id}
                            </div>
                            <div>
                              <span className="font-medium">Monthly Fee:</span>
                              <br />{formatPrice(service.monthly_fee || service.price || 0)}
                            </div>
                            <div>
                              <span className="font-medium">Installation Fee:</span>
                              <br />{formatPrice(service.installation_fee || 0)}
                            </div>
                            <div>
                              <span className="font-medium">Billing Cycle:</span>
                              <br />{service.billing_cycle || 'Monthly'}
                            </div>
                            <div>
                              <span className="font-medium">Start Date:</span>
                              <br />{service.start_date ? formatDate(service.start_date) : formatDate(service.created_at)}
                            </div>
                            <div>
                              <span className="font-medium">Equipment:</span>
                              <br />{service.equipment_info || 'Not specified'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md">
                            <Settings className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersPage
