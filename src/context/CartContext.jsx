import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)

  // Load cart when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart()
    } else {
      setCart([])
    }
  }, [isAuthenticated, user])

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCart(data)
      } else if (response.status === 401) {
        setCart([])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCart([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, requiresAuth: true }
    }

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: product.variantId || null,
          color: product.color || null,
          storage: product.storage || null,
          size: product.size || null,
          price: product.price,
          quantity,
        }),
      })

      if (response.status === 401) {
        return { success: false, requiresAuth: true }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to add to cart')
      }

      const newItem = await response.json()
      
      // Update local state
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.productId === product.id && item.variantId === (product.variantId || null))
        if (existingItem) {
          return prevCart.map((item) =>
            item.productId === product.id && item.variantId === (product.variantId || null)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [...prevCart, newItem]
      })

      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error: error.message }
    }
  }, [isAuthenticated])

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to remove from cart')
      }

      setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId))
      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(cartItemId)
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/${cartItemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        throw new Error('Failed to update quantity')
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      )

      return { success: true }
    } catch (error) {
      console.error('Error updating quantity:', error)
      return { success: false, error: error.message }
    }
  }, [removeFromCart])

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      return { success: false, requiresAuth: true }
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/clear`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.status === 401) {
        return { success: false, requiresAuth: true }
      }

      if (!response.ok) {
        throw new Error('Failed to clear cart')
      }

      setCart([])
      return { success: true }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, error: error.message }
    }
  }, [isAuthenticated])

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = Number(item.price || item.product?.basePrice || 0)
      return total + price * item.quantity
    }, 0)
  }, [cart])

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  const value = useMemo(
    () => ({
      cart,
      loading,
      user,
      isAuthenticated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      reload: loadCart,
    }),
    [cart, loading, user, isAuthenticated, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount, loadCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}