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

  const progressRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin')
      return
    }
    loadOrder()
  }, [orderId, isAuthenticated, navigate])

  useGSAP(() => {
    if (order) {
      gsap.to('#tracking-title', { opacity: 1, y: 0, duration: 1, delay: 0.3 })
      gsap.to('.tracking-section', { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.6 })
      gsap.to('.timeline-item', { opacity: 1, x: 0, stagger: 0.2, duration: 0.8, delay: 0.9 })
    }
  }, [order])

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
      PENDING: '⏳',
      CONFIRMED: '✅',
      PROCESSING: '📦',
      SHIPPED: '🚚',
      DELIVERED: '🎉',
      CANCELLED: '❌',
      REFUNDED: '💰'
    }
    return icons[status] || '📋'
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-400',
      CONFIRMED: 'text-green-400',
      PROCESSING: 'text-blue-400',
      SHIPPED: 'text-purple-400',
      DELIVERED: 'text-white',
      CANCELLED: 'text-red-400',
      REFUNDED: 'text-orange-400'
    }
    return colors[status] || 'text-gray-400'
  }

  const getStatusDate = (status) => {
    if (!order?.statusHistory) return null
    const statusRecord = order.statusHistory.find(h => h.status === status)
    return statusRecord ? statusRecord.createdAt : null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentStatus = order?.status
  const currentStatusIndex = Math.max(0, statuses.indexOf(currentStatus))

  useGSAP(() => {
    if (!progressRef.current) return
    const percent = (currentStatusIndex / (statuses.length - 1)) * 100
    gsap.to(progressRef.current, {
      height: `${percent}%`,
      duration: 1.2,
      ease: 'power2.inOut'
    })
  }, [currentStatusIndex])

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

      // Reload order to get updated statusHistory
      await loadOrder()
    } catch (err) {
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
                  className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Advance Status'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-5.5 top-8 bottom-8 w-1 bg-zinc-800">
                  <div ref={progressRef} className="bg-gradient-to-b from-blue-500 to-purple-500 w-full opacity-50" />
                </div>

                <div className="space-y-8">
                  {statuses.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex

                    const statusDate = getStatusDate(status)

                    return (
                      <div key={status} className="timeline-item opacity-0 -translate-x-10 flex gap-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0
                          ${isCompleted ? 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-75': 'bg-zinc-800'}
                          ${isCurrent && index!==statuses.length-1 ? 'animate-pulse' : ''}`}
                        >
                          <span className='opacity-100'>
                            {getStatusIcon(status)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold ${isCompleted ? 'text-green-400' : getStatusColor(status)}`}>{status}</h3>
                          <p className={`text-sm mt-1 ${statusDate ? 'text-gray-200' : 'text-gray-500'}`}>
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
              <p>Status: <span className={getStatusColor(order.status)}>{order.status}</span></p>
              <p>Total: ₹{formatIndianCurrency(order.total)}</p>
              <Link to="/" className="block mt-6 bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl text-center">
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