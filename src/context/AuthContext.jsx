import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const dismissSessionExpiredModal = useCallback(() => {
    setSessionExpired(false)
  }, [])

  const clearSessionExpiredNotice = useCallback(() => {
    setSessionExpiredNotice(false)
  }, [])

  // Check user session on mount
  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (mounted) {
            setUser(data)
            setIsAuthenticated(true)
            setSessionExpired(false)
            setSessionExpiredNotice(false)
          }
          return
        }

        if (response.status === 401 && mounted) {
          const errorData = await response.json().catch(() => ({}))
          const errorCode = errorData?.code || ''
          const errorMessage = errorData?.error || ''
          const shouldShowExpired = /expired|invalid|blocked/i.test(errorMessage)
            || ['TOKEN_EXPIRED', 'TOKEN_INVALID', 'TOKEN_BLOCKED'].includes(errorCode)

          setUser(null)
          setIsAuthenticated(false)
          setSessionExpired(shouldShowExpired)
          setSessionExpiredNotice(shouldShowExpired)
        }
      } catch (error) {
        console.error('Error checking user:', error)
        if (mounted) {
          setUser(null)
          setIsAuthenticated(false)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkUser()

    return () => {
      mounted = false
    }
  }, [API_URL])

  // Memoized signup function
  const signup = useCallback(async (email, password, name) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data?.error || 'Signup failed' }
      }

      if (data?.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        setSessionExpired(false)
        setSessionExpiredNotice(false)
      }

      return { success: true, data }
    } catch (error) {
      console.error('Signup exception:', error)
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      }
    }
  }, [API_URL])

  // Memoized signin function
  const signin = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data?.error || 'Signin failed' }
      }

      if (data?.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        setSessionExpired(false)
        setSessionExpiredNotice(false)
      }

      return { success: true, data }
    } catch (error) {
      console.error('Signin exception:', error)
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      }
    }
  }, [API_URL])

  // Memoized signout function
  const signout = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        return { success: false, error: data?.error || 'Signout failed' }
      }

      setUser(null)
      setIsAuthenticated(false)
      setSessionExpired(false)
      setSessionExpiredNotice(false)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      }
    }
  }, [API_URL])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      sessionExpired,
      sessionExpiredNotice,
      dismissSessionExpiredModal,
      clearSessionExpiredNotice,
      signup,
      signin,
      signout,
    }),
    [user, loading, isAuthenticated, sessionExpired, sessionExpiredNotice, dismissSessionExpiredModal, clearSessionExpiredNotice, signup, signin, signout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}