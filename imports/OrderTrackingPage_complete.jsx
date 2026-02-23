import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'

const OrderTrackingPage = () => {
  const { orderNumber } = useParams()
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
  }, [orderNumber, isAuthenticated, navigate])

  useGSAP(() => {
    if (order) {
      gsap.to('#tracking-title', { opacity: 1, y: 0, duration: 1, delay: 0.3, clearProps: 'all' })
      gsap.to('.tracking-section', { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.6, clearProps: 'all' })
      gsap.to('.timeline-item', { opacity: 1, x: 0, stagger: 0.2, duration: 0.8, delay: 0.9, clearProps: 'all' })
    }
  }, [order])

  const loadOrder = async () => {
    try {
      if (!orderNumber) {
        throw new Error('Invalid order number')
      }
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/orders/${orderNumber}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Order not found')
      }

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
      DELIVERED: 'text-green-500',
      CANCELLED: 'text-red-400',
      REFUNDED: 'text-orange-400'
    }
    return colors[status] || 'text-gray-400'
  }

  const statuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentStatus = order?.status
  const currentStatusIndex = Math.max(0, statuses.indexOf(currentStatus))

  useGSAP(() => {
    if (!progressRef.current || currentStatusIndex < 0) return
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
      const response = await fetch(`${API_URL}/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: nextStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const updatedOrder = await response.json()
      setOrder(updatedOrder)
    } catch (err) {
      console.error('Status update error:', err)
      alert('Failed to advance status. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading order...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="w-screen min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Order not found</h2>
          <p className="text-gray-400 mb-6">{error || 'Invalid order number'}</p>
          <Link to="/" className="text-blue-400 hover:underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <section className="w-screen min-h-screen bg-black text-white py-20">
      <div className="screen-max-width px-5">
        <div id="tracking-title" className="mb-12">
          <h1 className="text-6xl font-bold mb-4">Order Tracking</h1>
          <p className="text-gray-400 text-xl">Order #{order.orderNumber}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="tracking-section">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <h2 className="text-3xl font-bold">Delivery Status</h2>
                  <button
                    type="button"
                    onClick={handleAdvanceStatus}
                    disabled={currentStatusIndex >= statuses.length - 1 || updating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    {updating ? 'Updating...' : 'Advance Status'}
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-1 bg-zinc-800">
                    <div
                      ref={progressRef}
                      className="bg-gradient-to-b from-blue-500 to-purple-500 w-full transition-all"
                      style={{ height: '0%' }}
                    ></div>
                  </div>

                  <div className="space-y-8">
                    {statuses.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex
                      const isCurrent = index === currentStatusIndex
                      
                      return (
                        <div 
                          key={status}
                          className={`timeline-item relative flex gap-6 ${
                            isCompleted ? '' : 'opacity-50'
                          }`}
                        >
                          <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                            isCompleted 
                              ? isCompleted && index < currentStatusIndex
                                ? 'bg-green-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-zinc-800'
                          } ${isCurrent ? 'animate-pulse' : ''}`}>
                            {isCompleted && index < currentStatusIndex ? '✓' : getStatusIcon(status)}
                          </div>

                          <div className="flex-1 pb-8">
                            <h3 className={`text-xl font-bold mb-2 ${
                              isCompleted && index < currentStatusIndex
                                ? 'text-green-400'
                                : isCompleted
                                ? getStatusColor(status)
                                : 'text-gray-500'
                            }`}>
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </h3>
                            {order.statusHistory
                              ?.filter(h => h.status === status)
                              .map(history => (
                                <div key={history.id} className="text-sm text-gray-400">
                                  <p>{new Date(history.createdAt).toLocaleString()}</p>
                                  {history.notes && <p className="mt-1">{history.notes}</p>}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="tracking-section">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-6">Order Items</h2>
                
                <div className="space-y-4">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-black/30 rounded-2xl">
                      <div className="w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">📱</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{item.productName}</h3>
                        <p className="text-gray-400 text-sm">
                          {item.color && <span>{item.color}</span>}
                          {item.size && <span> • {item.size}</span>}
                          {item.storage && <span> • {item.storage}</span>}
                        </p>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-400">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="tracking-section">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold mb-6">Shipping Address</h2>
                  <div className="text-gray-300">
                    <p className="font-semibold mb-2">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="tracking-section sticky top-24">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-bold ${getStatusColor(currentStatus)}`}>
                      {currentStatus}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Date</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  {order.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tracking</span>
                      <span className="font-mono text-blue-400">{order.trackingNumber}</span>
                    </div>
                  )}

                  <div className="h-px bg-zinc-800"></div>

                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-400">${Number(order.total).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payment</span>
                    <span className={order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <Link 
                    to="/"
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-center transition-all transform hover:scale-105"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            <div className="tracking-section">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-4">Need Help?</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Contact our support team if you have any questions about your order.
                </p>
                <Link 
                  to="/contact"
                  className="block w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-xl text-center transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderTrackingPage
