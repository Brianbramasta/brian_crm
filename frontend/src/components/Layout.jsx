import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  )
}

export default Layout
