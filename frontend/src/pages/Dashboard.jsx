import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Briefcase, Wifi, DollarSign, Building, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { reportService } from '../services/reportService'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    setLoading(true)
    try {
      const result = await reportService.getDashboardStats()
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
    <div className="max-w-7xl mx-auto py-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.name}! Here's your PT Smart CRM overview.</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      ) : stats ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Leads */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLeads || user?.stats?.total_leads || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Deals */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Deals</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDeals || user?.stats?.total_deals || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers || user?.stats?.total_customers || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">This Month Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue || user?.stats?.this_month_revenue || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role-based Stats */}
          {user?.role === 'sales' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow-sm rounded-lg">
                <div className="p-6 text-white">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-blue-100">Qualified Leads</p>
                      <p className="text-2xl font-bold">{user?.stats?.qualified_leads || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow-sm rounded-lg">
                <div className="p-6 text-white">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-green-100">Won Deals</p>
                      <p className="text-2xl font-bold">{user?.stats?.won_deals || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow-sm rounded-lg">
                <div className="p-6 text-white">
                  <div className="flex items-center">
                    <Building className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-purple-100">My Customers</p>
                      <p className="text-2xl font-bold">{user?.stats?.total_customers || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manager specific stats */}
          {user?.role === 'manager' && user?.stats?.pending_approvals > 0 && (
            <div className="mb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-yellow-800">Pending Approvals</h3>
                    <p className="text-yellow-700">
                      You have {user.stats.pending_approvals} deal(s) waiting for approval.
                    </p>
                    <Link
                      to="/deals?status=waiting_approval"
                      className="inline-flex items-center mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900"
                    >
                      Review pending approvals →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/leads"
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <Users className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Add New Lead</p>
                      <p className="text-sm text-gray-500">Create new business opportunity</p>
                    </div>
                  </Link>
                  <Link
                    to="/deals"
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
                  >
                    <Briefcase className="h-8 w-8 text-gray-400 group-hover:text-green-500" />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Create Deal</p>
                      <p className="text-sm text-gray-500">Start new sales process</p>
                    </div>
                  </Link>
                  <Link
                    to="/products"
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
                  >
                    <Wifi className="h-8 w-8 text-gray-400 group-hover:text-purple-500" />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Manage Products</p>
                      <p className="text-sm text-gray-500">ISP packages and services</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Building className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">New customer registered</p>
                      <p className="text-sm text-gray-500">PT Global Tech Solutions - Internet 100Mbps</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Deal needs approval</p>
                      <p className="text-sm text-gray-500">CV Berkah Digital - Rp 8,5M deal</p>
                      <p className="text-xs text-gray-400">4 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">New lead created</p>
                      <p className="text-sm text-gray-500">Sekolah Harapan Bangsa - WiFi infrastructure</p>
                      <p className="text-xs text-gray-400">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-12 text-center text-gray-500">
          <p>No dashboard data available</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
