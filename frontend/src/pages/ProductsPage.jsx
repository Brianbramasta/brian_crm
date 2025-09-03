import React, { useState, useEffect } from 'react'
import { Wifi, Plus, Edit2, Trash2, Package, Signal, Globe } from 'lucide-react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    // TODO: Replace with actual API call
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'Internet Package 50Mbps',
          hpp: 500000, // Harga Pokok Penjualan
          margin_percent: 40,
          price: 700000, // Calculated: HPP + (HPP * margin/100)
          description: 'High-speed internet for small business',
          type: 'internet',
          bandwidth: '50Mbps',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Internet Package 100Mbps',
          hpp: 800000,
          margin_percent: 35,
          price: 1080000,
          description: 'Premium internet for medium business',
          type: 'internet',
          bandwidth: '100Mbps',
          created_at: '2024-01-20T14:20:00Z'
        },
        {
          id: '3',
          name: 'Dedicated Line 1Gbps',
          hpp: 5000000,
          margin_percent: 30,
          price: 6500000,
          description: 'Enterprise dedicated internet connection',
          type: 'dedicated',
          bandwidth: '1Gbps',
          created_at: '2024-02-01T09:15:00Z'
        },
        {
          id: '4',
          name: 'Cloud Server Basic',
          hpp: 1200000,
          margin_percent: 50,
          price: 1800000,
          description: 'Basic cloud server hosting package',
          type: 'cloud',
          bandwidth: 'N/A',
          created_at: '2024-02-10T16:45:00Z'
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Wifi className="h-8 w-8 mr-3 text-indigo-600" />
            ISP Product Catalog
          </h1>
          <p className="mt-2 text-gray-600">Manage internet services, packages, and pricing</p>
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
            <LoadingSpinner size="lg" text="Loading ISP services..." />
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  ISP Services & Packages ({products.length} products)
                </h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Service
                </button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Wifi className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg">No ISP services available</p>
                <p className="text-sm">Start by adding your first internet service package</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service / Package
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pricing Structure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bandwidth / Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                {product.type === 'internet' && <Wifi className="h-5 w-5 text-indigo-600" />}
                                {product.type === 'dedicated' && <Signal className="h-5 w-5 text-indigo-600" />}
                                {product.type === 'cloud' && <Globe className="h-5 w-5 text-indigo-600" />}
                                {!['internet', 'dedicated', 'cloud'].includes(product.type) && <Package className="h-5 w-5 text-indigo-600" />}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {product.type} Service
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium text-green-600">
                              Selling: {formatPrice(product.price)}
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>HPP: {formatPrice(product.hpp)}</div>
                              <div className="flex items-center justify-between">
                                <span>Margin: {product.margin_percent}%</span>
                                <span className="font-medium text-blue-600">
                                  +{formatPrice(product.price - product.hpp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">
                              {product.bandwidth}
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.type === 'dedicated'
                                ? 'bg-purple-100 text-purple-800'
                                : product.type === 'cloud'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {product.type.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {product.description || 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition duration-200">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ProductsPage
