import React, { useState, useEffect } from 'react'
import { Users, Plus, Edit2, Trash2, Phone, MapPin, DollarSign, Calendar, Activity } from 'lucide-react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const LeadsPage = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    // TODO: Replace with actual API call
    setTimeout(() => {
      setLeads([
        {
          id: '1',
          name: 'PT Global Tech Solutions',
          contact: '081234567890',
          address: 'Jl. Sudirman No. 123, Jakarta Selatan',
          kebutuhan: 'Internet dedicated 100Mbps untuk kantor pusat dengan 200 karyawan',
          status: 'new',
          owner: { name: 'Ahmad Susanto', id: 1 },
          created_at: '2024-08-25T10:30:00Z',
          last_contact: null,
          estimated_value: 15000000
        },
        {
          id: '2',
          name: 'CV Berkah Digital',
          contact: '082345678901',
          address: 'Jl. Gatot Subroto No. 456, Bandung',
          kebutuhan: 'Paket internet 50Mbps + cloud hosting untuk toko online',
          status: 'contacted',
          owner: { name: 'Siti Nurhaliza', id: 2 },
          created_at: '2024-08-20T14:15:00Z',
          last_contact: '2024-08-28T09:30:00Z',
          estimated_value: 8000000
        },
        {
          id: '3',
          name: 'Sekolah Harapan Bangsa',
          contact: '083456789012',
          address: 'Jl. Pendidikan No. 789, Surabaya',
          kebutuhan: 'WiFi untuk sekolah 500 siswa dengan bandwidth stabil',
          status: 'qualified',
          owner: { name: 'Budi Hartono', id: 3 },
          created_at: '2024-08-15T11:45:00Z',
          last_contact: '2024-08-30T16:20:00Z',
          estimated_value: 12000000
        },
        {
          id: '4',
          name: 'PT Manufacturing Indo',
          contact: '084567890123',
          address: 'Kawasan Industri Cikarang Blok A-15',
          kebutuhan: 'Internet untuk sistem monitoring produksi real-time',
          status: 'lost',
          owner: { name: 'Rina Sari', id: 4 },
          created_at: '2024-08-10T08:20:00Z',
          last_contact: '2024-08-22T14:30:00Z',
          estimated_value: 20000000,
          lost_reason: 'Memilih kompetitor dengan harga lebih murah'
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'lost':
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
            <Users className="h-8 w-8 mr-3 text-indigo-600" />
            Lead Management
          </h1>
          <p className="mt-2 text-gray-600">Manage ISP service prospects and potential customers</p>
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
            <LoadingSpinner size="lg" text="Loading leads..." />
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Sales Leads ({leads.length})
                  </h2>
                  <p className="text-sm text-gray-600">
                    Total Pipeline Value: {formatPrice(leads.reduce((sum, lead) => sum + lead.estimated_value, 0))}
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Lead
                </button>
              </div>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg">No leads available</p>
                <p className="text-sm">Start by adding your first potential customer</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {lead.name}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                          {lead.status === 'qualified' && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              Ready for Project
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {lead.contact}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {lead.address}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                            Est: {formatPrice(lead.estimated_value)}
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Requirements:</span> {lead.kebutuhan}
                          </p>
                        </div>

                        {lead.lost_reason && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-700">
                              <span className="font-medium">Lost Reason:</span> {lead.lost_reason}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              Owner: {lead.owner.name}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Created: {formatDate(lead.created_at)}
                            </div>
                            {lead.last_contact && (
                              <div className="flex items-center">
                                <Activity className="h-3 w-3 mr-1" />
                                Last Contact: {formatDate(lead.last_contact)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {lead.status === 'qualified' && (
                          <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-md transition duration-200" title="Convert to Project">
                            <DollarSign className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md transition duration-200">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition duration-200">
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
      </div>
    </Layout>
  )
}

export default LeadsPage
