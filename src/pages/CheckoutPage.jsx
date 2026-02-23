import { useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import { formatIndianCurrency } from '../utils/index'

// Initialize Stripe with error handling
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null

const CheckoutForm = () => {
  const { cart, getCartTotal, clearCart, user } = useCart()
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [saveAddress, setSaveAddress] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  // Fetch saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const response = await fetch(`${API_URL}/api/user/addresses`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const addresses = await response.json()
          setSavedAddresses(addresses)
        }
      } catch (err) {
        console.error('Error fetching addresses:', err)
      } finally {
        setLoadingAddresses(false)
      }
    }

    // Reset saveAddress checkbox on mount
    setSaveAddress(false)
    
    fetchAddresses()
  }, [])

  useGSAP(() => {
    gsap.fromTo('.checkout-section', 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.2 }
    )
  }, [loadingAddresses])

  const handleSelectAddress = (address) => {
    setShippingInfo({
      fullName: address.fullName,
      email: user?.email || '',
      phone: address.phone || '',
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country || 'United States'
    })
  }

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const createOrder = async (paymentIntentId, shouldSaveAddress) => {
    try {
      if (!user || !user.id) {
        throw new Error('User not authenticated. Please sign in and try again.')
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

      console.log('Creating order with:', { 
        items: cart, 
        total: getCartTotal() * 1.08, 
        paymentIntentId,
        saveAddress: shouldSaveAddress
      })
      console.log('shouldSaveAddress boolean value:', shouldSaveAddress)
      console.log('shouldSaveAddress type:', typeof shouldSaveAddress)

      // Create order via backend API
      const response = await fetch(`${API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cart,
          total: getCartTotal() * 1.08, // Including tax
          shippingInfo,
          paymentIntentId,
          saveAddress: shouldSaveAddress // Only save if user checked the box
        })
      })

      if (!response.ok) {
        const responseText = await response.text()
        console.error('Order API Error Response:', responseText)
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } catch (parseError) {
          throw new Error(`Server error (${response.status}): Check console for details`)
        }
      }

      const { order, success } = await response.json()

      if (!success || !order) {
        throw new Error('Failed to create order')
      }
      
      return order
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Capture saveAddress value at submission time
    const shouldSaveAddressNow = saveAddress
    console.log('🎯 At submit time - saveAddress checkbox is:', shouldSaveAddressNow)

    setLoading(true)
    setError(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const amount = getCartTotal() * 1.08 // Total with tax

      // Create payment intent on backend
      const response = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ amount })
      })

      if (!response.ok) {
        const responseText = await response.text()
        console.error('Payment API Error Response:', responseText)
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } catch (parseError) {
          throw new Error(`Server error (${response.status}): Check console for details`)
        }
      }

      const { clientSecret, paymentIntentId } = await response.json()

      // Confirm payment with Stripe
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: shippingInfo.fullName,
              email: shippingInfo.email,
              phone: shippingInfo.phone,
              address: {
                line1: shippingInfo.street,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.zipCode,
                country: 'US'
              }
            }
          }
        }
      )

      if (paymentError) {
        setError(paymentError.message)
        toast.error('Payment Failed', {
          description: paymentError.message,
          duration: 5000,
        })
        setLoading(false)
        return
      }

      // Create order in database
      const order = await createOrder(paymentIntent.id, shouldSaveAddressNow)

      console.log('Order created:', order)
      console.log('Order ID (UUID):', order?.id)
      console.log('Order Number:', order?.orderNumber)

      // Use order ID (UUID) for navigation
      const orderId = order?.id
      
      if (!orderId) {
        throw new Error('Order ID is missing from response')
      }

      // Show success toast
      toast.success('Order created successfully!', {
        description: `Order has been placed.`,
        duration: 5000,
      })

      // Clear cart
      await clearCart()

      // Reset form state
      setSaveAddress(false)

      console.log('About to navigate to /orders/details/' + orderId)
      setLoading(false)

      // Navigate to order details page using the details route
      setTimeout(() => {
        console.log('Executing navigation now')
        navigate(`/orders/${orderId}`, { replace: true })
      }, 500)

    } catch (err) {
      const errorMessage = err.message || 'Payment failed. Please try again.'
      setError(errorMessage)
      toast.error('Order Creation Failed', {
        description: errorMessage,
        duration: 5000,
      })
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#fff',
        '::placeholder': {
          color: '#6b7280'
        },
        backgroundColor: 'transparent'
      },
      invalid: {
        color: '#ef4444'
      }
    }
  }

  // Test card info element
  const TestCardInfo = () => (
    <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
      <p className="text-blue-400 text-sm font-semibold mb-2">🧪 Test Mode - Use These Card Numbers:</p>
      <div className="space-y-2 text-xs text-blue-300">
        <div className="flex items-center gap-2">
          <span>✓ Success:</span>
          <code className="bg-blue-900/50 px-2 py-1 rounded font-mono">4242 4242 4242 4242</code>
        </div>
        <div className="flex items-center gap-2">
          <span>✗ Decline:</span>
          <code className="bg-blue-900/50 px-2 py-1 rounded font-mono">4000 0000 0000 0002</code>
        </div>
        <p className="text-blue-400 pt-1">Any future expiry date, any 3-digit CVC</p>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Saved Addresses */}
      {!loadingAddresses && savedAddresses.length > 0 && (
        <div className="checkout-section">
          <h2 className="text-3xl font-bold mb-6">Saved Addresses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {savedAddresses.map((address) => (
              <button
                key={address.id}
                type="button"
                onClick={() => handleSelectAddress(address)}
                className="bg-zinc-900 border-2 border-zinc-800 hover:border-blue-500 rounded-xl p-4 text-left transition-all transform hover:scale-105 focus:outline-none focus:border-blue-500"
              >
                <p className="font-semibold text-white mb-2">{address.fullName}</p>
                <p className="text-gray-400 text-sm mb-1">{address.street}</p>
                <p className="text-gray-400 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                {address.phone && <p className="text-gray-400 text-sm mt-2">{address.phone}</p>}
                {address.isDefault && (
                  <span className="inline-block mt-3 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">Or enter a new address below:</p>
        </div>
      )}

      {/* Shipping Information */}
      <div className="checkout-section">
        <h2 className="text-3xl font-bold mb-6">Shipping Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={shippingInfo.fullName}
            onChange={handleInputChange}
            className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={shippingInfo.email}
            onChange={handleInputChange}
            className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            required
            value={shippingInfo.phone}
            onChange={handleInputChange}
            className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            required
            value={shippingInfo.street}
            onChange={handleInputChange}
            className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 md:col-span-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            required
            value={shippingInfo.city}
            onChange={handleInputChange}
            className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            required
            value={shippingInfo.state}
            onChange={handleInputChange}
            className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />
          <input
            type="text"
            name="zipCode"
            placeholder="ZIP Code"
            required
            value={shippingInfo.zipCode}
            onChange={handleInputChange}
            className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />
        </div>

        {/* Save Address Checkbox */}
        <div className="flex items-center gap-3 mt-6">
          <input
            type="checkbox"
            id="saveAddress"
            checked={saveAddress}
            onChange={(e) => setSaveAddress(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-zinc-800 bg-zinc-900 checked:bg-blue-600 checked:border-blue-600 cursor-pointer focus:outline-none focus:border-blue-500"
          />
          <label htmlFor="saveAddress" className="text-gray-400 cursor-pointer select-none">
            Save this address for future purchases
          </label>
        </div>
      </div>

      {/* Payment Information */}
      <div className="checkout-section">
        <h2 className="text-3xl font-bold mb-6">Payment Information</h2>
        
        {/* Test Card Info */}
        <TestCardInfo />
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-xl transition-all transform hover:scale-105"
      >
        {loading ? 'Processing...' : `Pay ₹${formatIndianCurrency(getCartTotal() * 1.08)}`}
      </button>
    </form>
  )
}

const CheckoutPage = () => {
  const { cart, getCartTotal } = useCart()
  const { loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const [stripeError, setStripeError] = useState(null)

  // Redirect to cart if empty (wait for auth to load first)
  useEffect(() => {
    if (!authLoading && cart.length === 0) {
      navigate('/cart')
    }
  }, [authLoading, cart, navigate])

  useEffect(() => {
    if (!stripePublishableKey) {
      setStripeError('Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.')
      setStripeLoaded(true)
      return
    }

    stripePromise
      .then(() => setStripeLoaded(true))
      .catch((err) => {
        setStripeError('Failed to load payment system: ' + err.message)
        setStripeLoaded(true)
      })
  }, [])

  useGSAP(() => {
    gsap.to('#checkout-title', { opacity: 1, y: 0, duration: 1, delay: 0.3 })
    gsap.to('#checkout-content', { opacity: 1, duration: 0.8, delay: 0.5 })
  }, [stripeLoaded])

  if (cart.length === 0) {
    return null // Will redirect via useEffect
  }

  if (!stripeLoaded) {
    return (
      <div className="w-screen min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading payment system...</p>
        </div>
      </div>
    )
  }

  if (stripeError) {
    return (
      <section className="w-screen min-h-screen bg-black text-white py-20">
        <div className="screen-max-width px-5">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-red-400">Payment System Unavailable</h2>
              <p className="text-red-300 mb-6">{stripeError}</p>
              <div className="bg-zinc-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">For Development:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Get your Stripe publishable key from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Stripe Dashboard</a></li>
                  <li>Add it to your <code className="bg-zinc-800 px-2 py-1 rounded">.env</code> file as <code className="bg-zinc-800 px-2 py-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...</code></li>
                  <li>Restart your development server</li>
                </ol>
              </div>
              <a href="/cart" className="inline-block mt-6 text-blue-400 hover:underline">← Back to Cart</a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-screen min-h-screen bg-black text-white py-20">
      <div className="screen-max-width px-5">
        <h1 id="checkout-title" className="text-6xl font-bold mb-12 opacity-0 translate-y-10">
          Checkout
        </h1>

        <div id="checkout-content" className="opacity-0">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div>

            {/* Order Summary */}
            <div className="checkout-section">
              <div className="sticky top-24 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="text-white">
                        ₹{formatIndianCurrency(Number(item.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="h-px bg-zinc-800"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{formatIndianCurrency(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax (8%)</span>
                    <span>₹{formatIndianCurrency(getCartTotal() * 0.08)}</span>
                  </div>
                  
                  <div className="h-px bg-zinc-800"></div>
                  
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-400">
                      ₹{formatIndianCurrency(getCartTotal() * 1.08)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckoutPage
