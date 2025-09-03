import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, Briefcase, Wifi, DollarSign, Building, Phone, TrendingUp, Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { reportService } from '../services/reportService'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    setLoading(true)
    try {
      const result = await reportService.getDashboardStats('month')
      if (result.success) {
        setStats(result.data)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load dashboard statistics. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const formatPrice = (price) => {
    if (!price) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(price)
  }
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to PT. Smart ISP CRM Dashboard</p>
        </div>

        {error && (
          <div className="px-4 py-6 sm:px-0">
            <ErrorMessage
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        {loading ? (
          <div className="px-4 py-12 sm:px-0 text-center">
            <LoadingSpinner size="lg" text="Loading dashboard..." />
          </div>
        ) : stats ? (
          <>
            {/* Stats */}
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Active Customers */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Building className="h-6 w-6 text-green-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Customers</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.totalCustomers || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                          <dd className="text-lg font-medium text-gray-900">{formatPrice(stats.totalRevenue || 0)}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Services */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Wifi className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Services</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.activeServices || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Leads */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-orange-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">New Leads This Month</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.newLeads || 0}</dd>
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
              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                  <div className="mt-5">
                    <div className="flow-root">
                      <ul className="-my-5 divide-y divide-gray-200">
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <Building className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                New customer: PT Global Tech Solutions
                              </p>
                              <p className="text-sm text-gray-500 truncate">Internet 100Mbps package - 2 hours ago</p>
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <Briefcase className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Project needs approval: CV Berkah Digital
                              </p>
                              <p className="text-sm text-gray-500 truncate">Rp 8,5M deal - Waiting manager approval</p>
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <Users className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                New lead: Sekolah Harapan Bangsa
                              </p>
                              <p className="text-sm text-gray-500 truncate">WiFi infrastructure for 500 students</p>
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
                    <Link
                      to="/leads"
                      className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Users className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">Add New Lead</span>
                    </Link>
                    <Link
                      to="/projects"
                      className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Briefcase className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">Create Project</span>
                    </Link>
                    <Link
                      to="/products"
                      className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Wifi className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">Add ISP Service</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        ) : (
          <div className="px-4 py-12 sm:px-0 text-center text-gray-500">
            <p>No dashboard data available</p>
          </div>
        )}
      </div>
      </Layout>
    )
  }

export default Dashboard
