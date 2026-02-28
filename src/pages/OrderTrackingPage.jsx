import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'
import { formatIndianCurrency } from '../utils/index'

const OrderTrackingPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  // Track which icons are "lit" separately from order status
  // so we can sequence: bar moves → then icon lights up
  const [litIndex, setLitIndex] = useState(0)
  const progressRef = useRef(null)

  const statuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

  const currentStatusIndex = Math.max(0, statuses.indexOf(order?.status))

  useEffect(() => {
    if (!isAuthenticated) { navigate('/signin'); return }
    loadOrder()
  }, [orderId, isAuthenticated])

  useGSAP(() => {
    if (order) {
      gsap.to('#tracking-title', { opacity: 1, y: 0, duration: 1, delay: 0.3 })
      gsap.to('.tracking-section', { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.6 })
      gsap.to('.timeline-item', { opacity: 1, x: 0, stagger: 0.2, duration: 0.8, delay: 0.9 })
    }
  }, [order])

  // When currentStatusIndex changes: animate bar first, then light up the icon
  useEffect(() => {
    if (!progressRef.current || !order) return

    const percent = currentStatusIndex === 0
      ? 0
      : (currentStatusIndex / (statuses.length - 1)) * 100

    // Step 1: animate bar
    gsap.to(progressRef.current, {
      height: `${percent}%`,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        // Step 2: light up icon only after bar reaches it
        setLitIndex(currentStatusIndex)
      }
    })
  }, [currentStatusIndex, order])

  const loadOrder = async () => {
    try {
      if (!orderId) throw new Error('Invalid order ID')
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/orders/details/${orderId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      if (!response.ok) throw new Error('Order not found')
      const data = await response.json()
      setOrder(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: '⏳', CONFIRMED: '✅', PROCESSING: '📦',
      SHIPPED: '🚚', DELIVERED: '🎉', CANCELLED: '❌', REFUNDED: '💰'
    }
    return icons[status] || '📋'
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-400', CONFIRMED: 'text-green-400',
      PROCESSING: 'text-blue-400', SHIPPED: 'text-purple-400',
      DELIVERED: 'text-white', CANCELLED: 'text-red-400', REFUNDED: 'text-orange-400'
    }
    return colors[status] || 'text-gray-400'
  }

  const getStatusDate = (status) => {
    if (!order?.statusHistory) return null
    const statusRecord = order.statusHistory.find(h => h.status === status)
    return statusRecord ? statusRecord.createdAt : null
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  const handleAdvanceStatus = async () => {
    const nextIndex = currentStatusIndex + 1
    if (nextIndex >= statuses.length) return

    const nextStatus = statuses[nextIndex]
    setUpdating(true)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      await loadOrder()
    } catch {
      alert('Failed to advance status.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="w-screen min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  }

  if (error || !order) {
    return (
      <div className="w-screen min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Order not found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/" className="text-blue-400 hover:underline">Return Home</Link>
        </div>
      </div>
    )
  }

  return (
    <section className="w-screen min-h-screen bg-black text-white py-20">
      <div className="screen-max-width px-5">

        <div id="tracking-title" className="opacity-0 translate-y-10 mb-12">
          <h1 className="text-6xl font-bold mb-4">Order Tracking</h1>
          <p className="text-gray-400 text-xl">Order #{order.orderNumber}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-2 tracking-section opacity-0 translate-y-10">
            <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800">
              <div className="flex justify-between mb-8">
                <h2 className="text-3xl font-bold">Delivery Status</h2>
                <button
                  onClick={handleAdvanceStatus}
                  disabled={currentStatusIndex >= statuses.length - 1 || updating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {updating ? 'Updating...' : 'Advance Status'}
                </button>
              </div>

              <div className="relative">
                {/* Track */}
                <div className="absolute left-[22px] top-10 bottom-10 w-0.5 bg-zinc-800">
                  {/* Filled progress bar — animates height via gsap ref */}
                  <div
                    ref={progressRef}
                    className="bg-gradient-to-b from-blue-500 to-purple-500 w-full"
                    style={{ height: '0%' }}
                  />
                </div>

                <div className="space-y-10">
                  {statuses.map((status, index) => {
                    // isLit is controlled by litIndex — set AFTER bar animation completes
                    const isLit = index <= litIndex
                    const isCurrent = index === currentStatusIndex
                    const statusDate = getStatusDate(status)

                    return (
                      <div key={status} className="timeline-item opacity-0 -translate-x-10 flex gap-6 items-center">
                        {/* Icon bubble */}
                        <div
                          className={`
                            w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0
                            transition-all duration-500
                            ${isLit
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50 scale-110'
                              : 'bg-zinc-800 scale-100'
                            }
                            ${isCurrent && index !== statuses.length - 1 && isLit ? 'animate-pulse' : ''}
                          `}
                        >
                          {getStatusIcon(status)}
                        </div>

                        <div className="flex-1">
                          <h3 className={`font-bold text-lg transition-colors duration-500 ${isLit ? getStatusColor(status) : 'text-gray-600'}`}>
                            {status}
                          </h3>
                          <p className={`text-sm mt-0.5 transition-colors duration-500 ${statusDate ? 'text-gray-300' : 'text-gray-600'}`}>
                            {statusDate ? formatDate(statusDate) : 'Pending'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="tracking-section opacity-0 translate-y-10">
            <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className={getStatusColor(order.status)}>{order.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-semibold">₹{formatIndianCurrency(order.total)}</span>
                </div>
              </div>
              <Link
                to="/"
                className="block mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-xl text-center font-semibold transition-all hover:scale-105"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default OrderTrackingPage