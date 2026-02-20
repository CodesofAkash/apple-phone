import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const OrderDetailsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useGSAP(() => {
    gsap.to('.order-details-header', { opacity: 1, y: 0, duration: 0.8 })
    gsap.to('.order-section', { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, delay: 0.2 })
  }, [order])

  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated) {
      navigate('/signin')
      return
    }

    const fetchOrder = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const response = await fetch(`${API_URL}/api/orders/details/${orderId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }

        const data = await response.json()
        setOrder(data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [authLoading, isAuthenticated, navigate, orderId])

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'SHIPPED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-500/10 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <section className="w-screen min-h-screen bg-black text-white py-20">
        <div className="screen-max-width px-5">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading order details...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="w-screen min-h-screen bg-black text-white py-20">
        <div className="screen-max-width px-5">
          <Link to="/orders" className="text-blue-400 hover:underline mb-8 inline-block">← Back to Orders</Link>
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-red-300">{error || 'Order not found'}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-screen min-h-screen bg-black text-white py-20">
      <div className="screen-max-width px-5">
        <Link to="/orders" className="text-blue-400 hover:underline mb-8 inline-block">← Back to Orders</Link>

        <div className="order-details-header opacity-0 translate-y-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2">Order {order.orderNumber}</h1>
              <p className="text-gray-400">Ordered on {formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-semibold border w-fit ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Section */}
            <div className="order-section opacity-0 translate-y-10">
              <h2 className="text-2xl font-bold mb-4">Order Items</h2>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
                {order.items && order.items.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-6 hover:bg-zinc-800/30 transition-colors">
                        <div className="flex gap-6">
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{item.productName}</h3>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Quantity</p>
                                <p className="text-white">{item.quantity}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Unit Price</p>
                                <p className="text-white">${parseFloat(item.price).toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Subtotal</p>
                                <p className="text-white font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    No items in this order
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="order-section opacity-0 translate-y-10">
                <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                  <p className="text-xl font-semibold mb-2">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-400">{order.shippingAddress.street}</p>
                  <p className="text-gray-400">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p className="text-gray-400">{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-400 mt-2">{order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="order-section opacity-0 translate-y-10">
                <h2 className="text-2xl font-bold mb-4">Status History</h2>
                <div className="space-y-3">
                  {order.statusHistory.map((history, idx) => (
                    <div key={history.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          {idx < order.statusHistory.length - 1 && (
                            <div className="w-1 h-12 bg-zinc-700"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{history.status}</p>
                          <p className="text-sm text-gray-400">{formatDate(history.createdAt)}</p>
                          {history.notes && <p className="text-gray-300 mt-1">{history.notes}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-section opacity-0 translate-y-10">
            <div className="sticky top-24 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${(parseFloat(order.total) / 1.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${(parseFloat(order.total) - parseFloat(order.total) / 1.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="h-px bg-zinc-700"></div>

              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span className="text-blue-400">${parseFloat(order.total).toFixed(2)}</span>
              </div>

              <div className="h-px bg-zinc-700"></div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Payment Status</p>
                  <p className={`font-semibold text-lg ${order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-gray-400'}`}>
                    {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                  <p className="text-white">{order.paymentMethod || 'Card'}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Tracking Number</p>
                    <p className="text-blue-400 font-mono">{order.trackingNumber}</p>
                  </div>
                )}
              </div>

              <Link
                to="/orders"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                View All Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderDetailsPage
