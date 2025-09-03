import React, { useState, useEffect } from 'react'
import { Users, Plus, Edit2, Trash2, Wifi, Calendar, Building, Phone, MapPin } from 'lucide-react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    // TODO: Replace with actual API call
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          name: 'PT Teknologi Indonesia',
          contact: '081234567890',
          address: 'Jl. Sudirman No. 123, Jakarta Selatan',
          services: [
            {
              id: '1',
              product: 'Internet 100Mbps',
              price: 1500000,
              status: 'active',
              start_date: '2024-01-15'
            },
            {
              id: '2',
              product: 'Dedicated Line 50Mbps',
              price: 3000000,
              status: 'active',
              start_date: '2024-02-01'
            }
          ],
          total_monthly: 4500000,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'CV Maju Berkembang',
          contact: '082345678901',
          address: 'Jl. Gatot Subroto No. 456, Bandung',
          services: [
            {
              id: '3',
              product: 'Internet 50Mbps',
              price: 800000,
              status: 'active',
              start_date: '2024-03-01'
            }
          ],
          total_monthly: 800000,
          created_at: '2024-03-01T14:20:00Z'
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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building className="h-8 w-8 mr-3 text-indigo-600" />
            Active Customers
          </h1>
          <p className="mt-2 text-gray-600">Manage your active ISP customers and their services</p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

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
                    Customer Database ({customers.length} customers)
                  </h2>
                  <p className="text-sm text-gray-600">
                    Total Monthly Revenue: {formatPrice(customers.reduce((sum, c) => sum + c.total_monthly, 0))}
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </button>
              </div>
            </div>

            {customers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg">No customers found</p>
                <p className="text-sm">Start by converting leads to customers</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <div key={customer.id} className="p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {customer.name}
                          </h3>
                          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {customer.contact}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {customer.address}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Customer since: {formatDate(customer.created_at)}
                          </div>
                          <div className="flex items-center font-medium text-indigo-600">
                            Monthly: {formatPrice(customer.total_monthly)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition duration-200">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Services List */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Wifi className="h-4 w-4 mr-2" />
                        Active Services ({customer.services.length})
                      </h4>

                      <div className="space-y-2">
                        {customer.services.map((service) => (
                          <div key={service.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">
                                  {service.product}
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(service.status)}`}>
                                  {service.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Started: {formatDate(service.start_date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {formatPrice(service.price)}
                              </div>
                              <div className="text-xs text-gray-500">
                                per month
                              </div>
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

export default CustomersPage
