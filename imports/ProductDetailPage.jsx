import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'

const ProductDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Selected options
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedStorage, setSelectedStorage] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  
  // Add to cart state
  const [addingToCart, setAddingToCart] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [slug])

  useGSAP(() => {
    if (product) {
      gsap.from('#product-image', { opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.4)' })
      gsap.from('#product-title', { opacity: 0, y: -30, duration: 0.8, delay: 0.3 })
      gsap.from('.option-section', { opacity: 0, y: 20, stagger: 0.15, duration: 0.8, delay: 0.5 })
      gsap.from('#buy-section', { opacity: 0, y: 20, duration: 0.8, delay: 1 })
    }
  }, [product])

  const loadProduct = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/products/${slug}`)
      
      if (!response.ok) throw new Error('Product not found')
      
      const data = await response.json()
      setProduct(data.product)
      setVariants(data.variants || [])
      
      // Set default selections
      if (data.variants?.length > 0) {
        const colors = [...new Set(data.variants.map(v => v.color))]
        const storages = [...new Set(data.variants.map(v => v.storage))]
        const sizes = [...new Set(data.variants.map(v => v.size))]
        
        setSelectedColor(colors[0])
        setSelectedStorage(storages[0])
        if (sizes.length > 0 && sizes[0]) setSelectedSize(sizes[0])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Find matching variant based on selections
  useEffect(() => {
    if (!selectedColor || !selectedStorage) return
    
    const variant = variants.find(v => 
      v.color === selectedColor && 
      v.storage === selectedStorage &&
      (selectedSize ? v.size === selectedSize : true)
    )
    
    setSelectedVariant(variant)
  }, [selectedColor, selectedStorage, selectedSize, variants])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/signin')
      return
    }

    if (!selectedVariant) {
      alert('Please select all options')
      return
    }

    setAddingToCart(true)
    
    const result = await addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      image: selectedVariant.images[0] || product.images[0],
      color: selectedColor,
      storage: selectedStorage,
      size: selectedSize,
      variantId: selectedVariant.id
    }, quantity)

    if (result.success) {
      setAddSuccess(true)
      gsap.to('#success-badge', {
        scale: [0, 1.2, 1],
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      })
      
      setTimeout(() => setAddSuccess(false), 3000)
    } else if (result.requiresAuth) {
      navigate('/signin')
    }

    setAddingToCart(false)
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    setTimeout(() => navigate('/cart'), 500)
  }

  // Get unique options
  const colors = [...new Set(variants.map(v => v.color))]
  const storages = [...new Set(variants.map(v => v.storage))]
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))]

  if (loading) return <Loader />

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Product Not Found</h2>
          <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300">
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  const currentPrice = selectedVariant?.price || product.basePrice

  return (
    <>
      <Helmet>
        <title>{product.name} - Select Your Options</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <section className="min-h-screen bg-black text-white py-20">
        <div className="screen-max-width px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div id="product-image" className="sticky top-24">
              <div className="relative aspect-square bg-zinc-900 rounded-3xl overflow-hidden">
                <img
                  src={selectedVariant?.images[0] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
                {addSuccess && (
                  <div id="success-badge" className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full opacity-0">
                    ✓ Added to cart!
                  </div>
                )}
              </div>
            </div>

            {/* Product Options */}
            <div>
              <h1 id="product-title" className="text-5xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-400 text-lg mb-8">{product.description}</p>

              {/* Price */}
              <div className="mb-8">
                <p className="text-4xl font-bold text-blue-400">
                  ${Number(currentPrice).toLocaleString()}
                </p>
                {selectedVariant && selectedVariant.price !== product.basePrice && (
                  <p className="text-sm text-gray-500">
                    Starting at ${Number(product.basePrice).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="option-section mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Color: <span className="text-blue-400">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color) => {
                      const variant = variants.find(v => v.color === color)
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`group relative w-16 h-16 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? 'border-blue-500 scale-110'
                              : 'border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: variant?.colorHex || '#666' }}
                          />
                          {selectedColor === color && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Storage Selection */}
              {storages.length > 0 && (
                <div className="option-section mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Storage: <span className="text-blue-400">{selectedStorage}</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {storages.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedStorage === storage
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        <p className="font-bold text-lg">{storage}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 1 && (
                <div className="option-section mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Size: <span className="text-blue-400">{selectedSize}</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        <p className="font-bold text-lg">{size}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="option-section mb-8">
                <h3 className="text-xl font-semibold mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-xl font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-xl font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              {selectedVariant && (
                <div className="mb-8">
                  {selectedVariant.inStock ? (
                    <p className="text-green-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      In Stock - {selectedVariant.stockCount} available
                    </p>
                  ) : (
                    <p className="text-red-400">Out of Stock</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div id="buy-section" className="space-y-4">
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart || !selectedVariant?.inStock}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-xl transition-all transform hover:scale-105"
                >
                  {addingToCart ? 'Adding...' : 'Buy Now'}
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !selectedVariant?.inStock}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-5 rounded-xl transition-colors"
                >
                  Add to Cart
                </button>
              </div>

              {/* Features */}
              <div className="mt-12 pt-8 border-t border-zinc-800">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Free shipping on all orders
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    30-day return policy
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    1-year warranty included
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductDetailPage
