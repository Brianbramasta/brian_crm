import React from 'react'
import { Link } from 'react-router-dom'
import { Users, CheckCircle, ShoppingCart, BarChart3 } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PT Smart CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Welcome back!</span>
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your CRM dashboard</p>
          </div>

          {/* Stats */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Customers */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                        <dd className="text-lg font-medium text-gray-900">1,234</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Tasks */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Tasks</dt>
                        <dd className="text-lg font-medium text-gray-900">24</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Products</dt>
                        <dd className="text-lg font-medium text-gray-900">156</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                        <dd className="text-lg font-medium text-gray-900">$12,345</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tasks */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Tasks</h3>
                  <div className="mt-5">
                    <div className="flow-root">
                      <ul className="-my-5 divide-y divide-gray-200">
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <CheckCircle className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Follow up with customer John Doe
                              </p>
                              <p className="text-sm text-gray-500 truncate">Completed 2 hours ago</p>
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <CheckCircle className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Prepare quarterly report
                              </p>
                              <p className="text-sm text-gray-500 truncate">Due in 3 days</p>
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <CheckCircle className="h-6 w-6 text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Update product catalog
                              </p>
                              <p className="text-sm text-gray-500 truncate">Overdue</p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                  <div className="mt-5 grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Users className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">Add New Customer</span>
                    </button>
                    <button
                      type="button"
                      className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <CheckCircle className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">Create Task</span>
                    </button>
                    <button
                      type="button"
                      className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <ShoppingCart className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">Add Product</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
