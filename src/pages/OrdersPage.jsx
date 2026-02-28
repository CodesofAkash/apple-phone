import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { formatIndianCurrency } from '../utils/index'

const OrdersPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useGSAP(() => {
    gsap.to('.orders-header', { opacity: 1, y: 0, duration: 0.8 })
    gsap.to('.order-card', { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, delay: 0.2 })
  }, [orders])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { navigate('/signin'); return }
    fetchOrders()
  }, [authLoading, isAuthenticated, navigate])

  const fetchOrders = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/orders`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      // 404 = no orders found, treat as empty not an error
      if (response.status === 404) {
        setOrders([])
        return
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      // Network errors only — not "no orders"
      console.error('Error fetching orders:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':  return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'PROCESSING': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'SHIPPED':    return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'DELIVERED':  return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'CANCELLED':
      case 'REFUNDED':   return 'bg-red-500/10 text-red-400 border-red-500/30'
      default:           return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  if (loading) {
    return (
      <section className="w-screen min-h-screen bg-black text-white py-20">
        <div className="screen-max-width px-5 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading your orders...</p>
          </div>
        </div>
      </section>
    )
  }

  // Network/server error — not "no orders"
  if (error) {
    return (
      <section className="w-screen min-h-screen bg-black text-white py-20">
        <div className="screen-max-width px-5 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="w-20 h-20 mx-auto mb-6 text-red-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-8">We couldn't load your orders. Please try again.</p>
            <button
              onClick={() => { setError(null); setLoading(true); fetchOrders() }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-screen min-h-screen bg-black text-white py-20">
      <div className="screen-max-width px-5">
        <div className="orders-header opacity-0 translate-y-10">
          <h1 className="text-5xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-400 mb-12">View and manage all your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-zinc-900 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3">No orders yet</h2>
            <p className="text-gray-400 mb-10 max-w-sm mx-auto">
              Looks like you haven't placed any orders yet. Explore our products and find something you love!
            </p>
            <Link
              to="/products/apple-phone"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="order-card opacity-0 translate-y-10 block"
              >
                <div className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-2xl p-6 transition-all transform hover:scale-[1.01]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold">{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">Ordered on {formatDate(order.createdAt)}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Items</p>
                          <p className="text-white font-semibold">{order.items?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className="text-white font-semibold text-lg">₹{formatIndianCurrency(order.total)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment</p>
                          <p className={`font-semibold ${order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-gray-400'}`}>
                            {order.paymentStatus}
                          </p>
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <p className="text-gray-500">Tracking</p>
                            <p className="text-blue-400 font-mono text-sm">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default OrdersPage