import React, { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Edit2, Trash2, Package } from 'lucide-react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { productService } from '../services/productService'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const result = await productService.getAllProducts()

    if (result.success) {
      setProducts(result.data)
      setError('')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price)
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID').format(number)
  }

  return (
    <Layout>
      <div className=\"max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8\">
        <div className=\"mb-8\">
          <h1 className=\"text-3xl font-bold text-gray-900 flex items-center\">
            <Package className=\"h-8 w-8 mr-3 text-indigo-600\" />
            Products
          </h1>
          <p className=\"mt-2 text-gray-600\">Manage your product catalog</p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
            className=\"mb-6\"
          />
        )}

        {loading ? (
          <div className=\"text-center py-12\">
            <LoadingSpinner size=\"lg\" text=\"Loading products...\" />
          </div>
        ) : (
          <div className=\"bg-white shadow-lg rounded-lg overflow-hidden\">
            <div className=\"px-6 py-4 border-b border-gray-200 bg-gray-50\">
              <div className=\"flex justify-between items-center\">
                <h2 className=\"text-lg font-medium text-gray-900\">
                  Product Catalog ({products.length} items)
                </h2>
                <button className=\"px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center\">
                  <Plus className=\"h-4 w-4 mr-2\" />
                  Add Product
                </button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className=\"p-12 text-center text-gray-500\">
                <Package className=\"h-16 w-16 mx-auto text-gray-300 mb-4\" />
                <p className=\"text-lg\">No products available</p>
                <p className=\"text-sm\">Start by adding your first product</p>
              </div>
            ) : (
              <div className=\"overflow-x-auto\">
                <table className=\"min-w-full divide-y divide-gray-200\">
                  <thead className=\"bg-gray-50\">
                    <tr>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Product
                      </th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Price Details
                      </th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Stock
                      </th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Description
                      </th>
                      <th className=\"px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className=\"bg-white divide-y divide-gray-200\">
                    {products.map((product) => (
                      <tr key={product.id} className=\"hover:bg-gray-50 transition duration-200\">
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"flex items-center\">
                            <div className=\"flex-shrink-0 h-10 w-10\">
                              <div className=\"h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center\">
                                <Package className=\"h-5 w-5 text-indigo-600\" />
                              </div>
                            </div>
                            <div className=\"ml-4\">
                              <div className=\"text-sm font-medium text-gray-900\">
                                {product.name}
                              </div>
                              <div className=\"text-sm text-gray-500\">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"text-sm text-gray-900\">
                            <div className=\"font-medium\">
                              Selling: {formatPrice(product.price)}
                            </div>
                            <div className=\"text-xs text-gray-500\">
                              HPP: {formatPrice(product.hpp)} | Margin: {product.margin_percent}%
                            </div>
                          </div>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"text-sm text-gray-900\">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${\n                              product.stock > 10 \n                                ? 'bg-green-100 text-green-800'\n                                : product.stock > 0\n                                ? 'bg-yellow-100 text-yellow-800'\n                                : 'bg-red-100 text-red-800'\n                            }`}>\n                              {formatNumber(product.stock)} units\n                            </span>\n                          </div>\n                        </td>\n                        <td className=\"px-6 py-4\">\n                          <div className=\"text-sm text-gray-900 max-w-xs truncate\">\n                            {product.description || 'No description'}\n                          </div>\n                        </td>\n                        <td className=\"px-6 py-4 whitespace-nowrap text-right text-sm font-medium\">\n                          <div className=\"flex items-center justify-end space-x-2\">\n                            <button className=\"text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition duration-200\">\n                              <Edit2 className=\"h-4 w-4\" />\n                            </button>\n                            <button className=\"text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200\">\n                              <Trash2 className=\"h-4 w-4\" />\n                            </button>\n                          </div>\n                        </td>\n                      </tr>\n                    ))}\n                  </tbody>\n                </table>\n              </div>\n            )}\n          </div>\n        )}\n      </div>\n    </Layout>\n  )\n}\n\nexport default ProductsPage
