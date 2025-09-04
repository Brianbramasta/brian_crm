import React, { useState, useEffect } from 'react'
import { BarChart3, Download, Calendar, TrendingUp, Users, DollarSign, Wifi, FileText } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { reportService } from '../services/reportService'
import { useAuth } from '../contexts/AuthContext'

const ReportsPage = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [statistics, setStatistics] = useState(null)

  useEffect(() => {
    loadReports()
    loadStatistics()
  }, [selectedPeriod, dateRange])

  const loadReports = async () => {
    setLoading(true)
    try {
      const result = await reportService.getAllReports()
      if (result.success) {
        setReports(result.data)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load reports. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const result = await reportService.getDashboardStats(selectedPeriod)
      if (result.success) {
        setStatistics(result.data)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load statistics. Please try again.')
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
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExportReport = async (reportType, reportId) => {
    try {
      const result = await reportService.downloadReport(reportType, reportId)
      if (result.success) {
        // Download handled by the service
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to export report. Please try again.')
    }
  }

  const generateNewReport = async (type) => {
    setLoading(true)
    try {
      let result
      switch (type) {
        case 'sales':
          result = await reportService.generateSalesReport(dateRange)
          break
        case 'revenue':
          result = await reportService.generateRevenueReport(dateRange)
          break
        case 'customer':
          result = await reportService.generateCustomerReport(dateRange)
          break
        default:
          setError('Unknown report type')
          return
      }

      if (result.success) {
        setError('')
        // Reload reports to show the new one
        loadReports()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Check permissions for reports access
  if (user?.role === 'sales' && !user?.permissions?.can_view_reports) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You don't have permission to view reports. Please contact your manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-8 w-8 mr-3 text-indigo-600" />
          Reports & Analytics
        </h1>
        <p className="mt-2 text-gray-600">
          {user?.role === 'manager'
            ? 'Comprehensive business intelligence and performance reports'
            : 'Your sales performance and assigned reports'
          }
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-medium text-gray-900">Report Period</h3>
            <p className="text-sm text-gray-500">Select date range for reports</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-2">
              {[
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
                { key: 'quarter', label: 'This Quarter' },
                { key: 'year', label: 'This Year' }
              ].map((period) => (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    selectedPeriod === period.key
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {user?.role === 'sales' ? 'My Total Revenue' : 'Total Revenue'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{formatPrice(statistics.totalRevenue || 0)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {user?.role === 'sales' ? 'My Customers' : 'Total Customers'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.totalCustomers || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wifi className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Services</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.activeServices || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.conversionRate || 0}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {statistics && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {user?.role === 'sales' ? 'My Performance Indicators' : 'Key Performance Indicators'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{formatPrice(statistics.avgDealValue || 0)}</div>
              <div className="text-sm text-gray-500">Average Deal Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statistics.monthlyGrowth || 0}%</div>
              <div className="text-sm text-gray-500">Monthly Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statistics.customerRetention || 0}%</div>
              <div className="text-sm text-gray-500">Customer Retention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{statistics.newLeads || 0}</div>
              <div className="text-sm text-gray-500">
                {user?.role === 'sales' ? 'My New Leads' : 'New Leads This Month'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Report Generation */}
      {user?.role === 'manager' && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generate New Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateNewReport('sales')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <span className="block text-sm font-medium text-gray-900">Sales Report</span>
            </div>
          </button>

          <button
            onClick={() => generateNewReport('revenue')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="text-center">
              <DollarSign className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <span className="block text-sm font-medium text-gray-900">Revenue Report</span>
            </div>
          </button>

          <button
            onClick={() => generateNewReport('customer')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="text-center">
              <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <span className="block text-sm font-medium text-gray-900">Customer Report</span>
            </div>
          </button>
        </div>
      </div>
      )}

      {/* Generated Reports List */}
      {loading ? (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" text="Loading reports..." />
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {user?.role === 'sales' ? 'My Reports' : 'Generated Reports'} ({reports.length})
                </h2>
                <p className="text-sm text-gray-600">
                  {user?.role === 'manager'
                    ? 'All system generated reports'
                    : 'Reports available to you'
                  }
                </p>
              </div>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-lg">No reports available</p>
              <p className="text-sm">
                {user?.role === 'manager'
                  ? 'Generate your first report above'
                  : 'No reports have been shared with you yet'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {report.title || 'Untitled Report'}
                          </h3>
                          <p className="text-sm text-gray-600">{report.description || 'No description'}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Generated: {formatDate(report.generated_at || report.created_at)}</span>
                            {report.file_size && <span>Size: {report.file_size}</span>}
                            <span className="capitalize">Type: {report.type || 'General'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExportReport(report.type, report.id)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition duration-200"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Excel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReportsPage
