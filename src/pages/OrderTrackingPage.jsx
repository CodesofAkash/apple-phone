import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { supabase } from '../lib/supabase'

const OrderTrackingPage = () => {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadOrder()
  }, [orderNumber])

  useGSAP(() => {
    if (order) {
      gsap.to('#tracking-title', { opacity: 1, y: 0, duration: 1, delay: 0.3 })
      gsap.to('.tracking-section', { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.6 })
      gsap.to('.timeline-item', { opacity: 1, x: 0, stagger: 0.2, duration: 0.8, delay: 0.9 })
    }
  }, [order])

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          shippingAddress:addresses!shippingAddressId(*),
          statusHistory:order_status_history(*)
        `)
        .eq('orderNumber', orderNumber)
        .single()

      if (error) throw error
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

  const currentStatusIndex = statuses.indexOf(order.status)

  return (
    <section className="w-screen min-h-screen bg-black text-white py-20">
      <div className="screen-max-width px-5">
        {/* Header */}
        <div id="tracking-title" className="opacity-0 translate-y-10 mb-12">
          <h1 className="text-6xl font-bold mb-4">Order Tracking</h1>
          <p className="text-gray-400 text-xl">Order #{order.orderNumber}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Timeline */}
            <div className="tracking-section opacity-0 translate-y-10">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-8">Delivery Status</h2>
                
                {/* Timeline */}
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-8 bottom-8 w-1 bg-zinc-800">
                    <div 
                      className="bg-linear-to-b from-blue-500 to-purple-500 w-full transition-all duration-1000"
                      style={{ height: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  {/* Timeline Items */}
                  <div className="space-y-8">
                    {statuses.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex
                      const isCurrent = index === currentStatusIndex
                      
                      return (
                        <div 
                          key={status}
                          className={`timeline-item opacity-0 translate-x-[-50px] relative flex gap-6 ${
                            isCompleted ? '' : 'opacity-50'
                          }`}
                        >
                          {/* Icon */}
                          <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                            isCompleted 
                              ? 'bg-linear-to-r from-blue-500 to-purple-500' 
                              : 'bg-zinc-800'
                          } ${isCurrent ? 'animate-pulse' : ''}`}>
                            {getStatusIcon(status)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-8">
                            <h3 className={`text-xl font-bold mb-2 ${
                              isCompleted ? getStatusColor(status) : 'text-gray-500'
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

            {/* Order Items */}
            <div className="tracking-section opacity-0 translate-y-10">
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
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-400">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="tracking-section opacity-0 translate-y-10">
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

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="tracking-section opacity-0 translate-y-10 sticky top-24">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
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
                    <span className="text-blue-400">${parseFloat(order.total).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payment Status</span>
                    <span className={order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <Link 
                    to="/"
                    className="block w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-center transition-all transform hover:scale-105"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="tracking-section opacity-0 translate-y-10">
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
