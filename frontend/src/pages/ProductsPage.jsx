import React, { useState, useEffect } from 'react'
import { Wifi, Plus, Edit2, Trash2, Package, Signal, Globe, X, Save } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { productService } from '../services/productService'
import { useAuth } from '../contexts/AuthContext'

const ProductsPage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hpp: '',
    margin_percentage: '',
    category: 'residential',
    bandwidth: '',
    is_active: true
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const result = await productService.getAllProducts()
      if (result.success) {
        setProducts(result.data.data || result.data)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      hpp: '',
      margin_percentage: '',
      category: 'residential',
      bandwidth: '',
      is_active: true
    })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      hpp: product.hpp || '',
      margin_percentage: product.margin_percentage || '',
      category: product.category || 'residential',
      bandwidth: product.bandwidth || '',
      is_active: product.is_active !== false
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result
      const productData = {
        ...formData,
        hpp: parseFloat(formData.hpp),
        margin_percentage: parseFloat(formData.margin_percentage)
      }

      if (editingProduct) {
        result = await productService.updateProduct(editingProduct.id, productData)
      } else {
        result = await productService.createProduct(productData)
      }

      if (result.success) {
        await loadProducts()
        setShowModal(false)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to save product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const result = await productService.deleteProduct(productId)
      if (result.success) {
        await loadProducts()
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to delete product. Please try again.')
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'residential': return <Wifi className="h-5 w-5 text-blue-600" />
      case 'corporate': return <Signal className="h-5 w-5 text-purple-600" />
      case 'gaming': return <Package className="h-5 w-5 text-red-600" />
      case 'hotspot': return <Globe className="h-5 w-5 text-green-600" />
      default: return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory)

  const categoryCounts = {
    all: products.length,
    residential: products.filter(p => p.category === 'residential').length,
    corporate: products.filter(p => p.category === 'corporate').length,
    gaming: products.filter(p => p.category === 'gaming').length,
    hotspot: products.filter(p => p.category === 'hotspot').length,
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Wifi className="h-8 w-8 mr-3 text-indigo-600" />
          ISP Product Catalog
        </h1>
        <p className="mt-2 text-gray-600">Manage internet services, packages, and pricing</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Products', count: categoryCounts.all },
              { key: 'residential', label: 'Residential', count: categoryCounts.residential },
              { key: 'corporate', label: 'Corporate', count: categoryCounts.corporate },
              { key: 'gaming', label: 'Gaming', count: categoryCounts.gaming },
              { key: 'hotspot', label: 'Hotspot', count: categoryCounts.hotspot },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedCategory === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    selectedCategory === tab.key
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
            <LoadingSpinner size="lg" text="Loading ISP services..." />
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    ISP Services & Packages ({filteredProducts.length})
                  </h2>
                  <p className="text-sm text-gray-600">
                    {user?.role === 'manager' ? 'Manage all products and pricing' : 'View available products'}
                  </p>
                </div>
                {user?.permissions?.can_manage_products && (
                  <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Service
                  </button>
                )}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Wifi className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg">No ISP services found</p>
                <p className="text-sm">
                  {selectedCategory === 'all'
                    ? 'Start by adding your first internet service package'
                    : `No ${selectedCategory} products available`
                  }
                </p>
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
  )
}

export default ProductsPage
