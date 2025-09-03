import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, Users, Wifi, Building, Briefcase, BarChart3 } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Products', href: '/products', icon: Wifi },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Customers', href: '/customers', icon: Building },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">PT Smart CRM</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{user?.role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200">
              Logout
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-200"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-200 mb-2">
                {user?.name} ({user?.role})
              </div>
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
