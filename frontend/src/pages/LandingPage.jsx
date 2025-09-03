import React from 'react'
import { Link } from 'react-router-dom'
import { Users, CheckCircle, BarChart3, Shield } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">PT Smart CRM</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Manage your</span>{' '}
              <span className="block text-indigo-600 xl:inline">customers better</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              PT Smart CRM helps you streamline customer relationships, track tasks, and manage your business processes efficiently.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-200"
                >
                  Start Free Trial
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="#features"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage your business
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our CRM system provides all the tools you need to grow your business and maintain strong customer relationships.
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Customer Management</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Centralized customer data management with comprehensive profiles and interaction history.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Task Tracking</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Keep track of tasks and follow-ups to ensure nothing falls through the cracks.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Analytics & Reports</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Get insights into your business performance with detailed analytics and reporting.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Shield className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure & Reliable</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Enterprise-grade security with role-based access control and data protection.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Start your free trial today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-200">
              Join thousands of businesses that trust PT Smart CRM to manage their customer relationships.
            </p>
            <Link
              to="/login"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition duration-200"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <p className="text-center text-sm text-gray-500">
              Built with React & Laravel
            </p>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2025 PT Smart CRM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
