import { useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, loading } = useCart()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect to signin if user is not authenticated (wait for auth to load first)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.info('Not logged in', {
        description: 'Please login first to access your cart.',
        duration: 5000,
      })
      navigate('/signin', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  useGSAP(() => {
    gsap.to('#cart-title', { opacity: 1, y: 0, duration: 1, delay: 0.3 })
    gsap.to('.cart-item', { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, delay: 0.6 })
    gsap.to('#cart-summary', { opacity: 1, x: 0, duration: 1, delay: 0.9 })
  }, [cart])

  const handleQuantityChange = async (itemId, newQuantity) => {
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId)
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading cart...</div>
      </div>
    )
  }

  return (
    <section className="w-screen min-h-screen bg-black text-white overflow-hidden relative py-20">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 screen-max-width px-5">
        {/* Header */}
        <h1 id="cart-title" className="text-6xl md:text-8xl font-bold mb-12 opacity-0 translate-y-10">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-20">
            <div className="text-8xl mb-8">🛒</div>
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some amazing products to get started!</p>
            <Link 
              to="/"
              className="inline-block bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="cart-item opacity-0 translate-y-10 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-6 hover:border-zinc-700 transition-all"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-32 h-32 bg-zinc-800 rounded-2xl overflow-hidden">
                      {item.product.image ? (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          📱
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{item.product.name}</h3>
                      <p className="text-gray-400 mb-4">
                        {item.product.color && <span>{item.product.color}</span>}
                        {item.product.size && <span> • {item.product.size}</span>}
                        {item.product.storage && <span> • {item.product.storage}</span>}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3 bg-black/30 rounded-xl p-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-400">
                            ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${parseFloat(item.product.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="flex-shrink-0 w-10 h-10 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <svg className="w-5 h-5 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div 
                id="cart-summary"
                className="opacity-0 translate-x-10 sticky top-24 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-zinc-800"></div>
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-400">
                      ${(getCartTotal() * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="block text-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    <span className="text-sm text-gray-400">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="text-sm text-gray-400">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-9l1.96 2.5H17V9h2.5zm-1.5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                    </svg>
                    <span className="text-sm text-gray-400">30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CartPage
