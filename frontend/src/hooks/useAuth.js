import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { vendorApi } from '../utils/api'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token with backend
      // setUser(decodedToken)
      setUser({ name: 'Vendor Dashboard', role: 'vendor' })
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await vendorApi.login(credentials)
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      return true
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  // Redirect to login if not authenticated and trying to access protected route
  useEffect(() => {
    if (!user && !loading && location.pathname !== '/login') {
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate, location])

  return { user, login, logout, loading }
}

