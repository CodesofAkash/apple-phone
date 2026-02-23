import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import SimpleLoader from '../components/SimpleLoader'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { formatIndianCurrency } from '../utils/index'
import Lights from '../components/Lights'
import IPhone from '../components/IPhone'
import { models } from '../constants'
import * as THREE from 'three'

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
  const [selectedSize, setSelectedSize] = useState('small')
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  
  // Add to cart state
  const [addingToCart, setAddingToCart] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  // 3D Model state
  const [modelItem, setModelItem] = useState(models[0])
  
  const controlRef = useRef()
  const mountedRef = useRef(true)
  const canvasContainerRef = useRef()
  
  const [canvasReady, setCanvasReady] = useState(false)

  // Load Canvas only when the container scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanvasReady(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current)
    return () => observer.disconnect()
  }, [])

  const getSizeBucket = (sizeValue) => {
    const match = String(sizeValue || '').match(/[\d.]+/)
    if (!match) return null
    const numericSize = Number(match[0])
    if (Number.isNaN(numericSize)) return null
    return numericSize <= 6.2 ? 'small' : 'large'
  }

  useEffect(() => {
    mountedRef.current = true
    loadProduct()
    
    return () => {
      mountedRef.current = false
    }
  }, [slug])

  // Only animate on initial load, don't hide content
  useGSAP(() => {
    if (product && mountedRef.current) {
      // Start from visible, just add subtle animations
      gsap.from('#product-canvas', { 
        opacity: 0.5, 
        y: 20,
        duration: 0.8, 
        ease: 'power2.out',
        clearProps: 'all' // Remove inline styles after animation
      })
      gsap.from('#product-title', { 
        opacity: 0, 
        y: -20, 
        duration: 0.6, 
        delay: 0.2,
        clearProps: 'all'
      })
      gsap.from('.option-section', { 
        opacity: 0, 
        y: 10, 
        stagger: 0.1, 
        duration: 0.5, 
        delay: 0.3,
        clearProps: 'all'
      })
      gsap.from('#buy-section', { 
        opacity: 0, 
        y: 10, 
        duration: 0.5, 
        delay: 0.6,
        clearProps: 'all'
      })
    }
  }, [product])

  // Update 3D model when color changes
  useEffect(() => {
    if (!selectedColor || !variants.length || !mountedRef.current) return

    const colorModel = models.find(m => 
      m.title.toLowerCase().includes(selectedColor.toLowerCase().split(' ')[0])
    )

    if (colorModel) {
      setModelItem(colorModel)
    }
  }, [selectedColor, variants])

  const loadProduct = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/products/${slug}`)
      
      if (!response.ok) throw new Error('Product not found')
      
      const data = await response.json()
      
      if (!mountedRef.current) return
      
      setProduct(data.product)
      setVariants(data.variants || [])
      
      // Set default selections
      if (data.variants?.length > 0) {
        const colors = [...new Set(data.variants.map(v => v.color))]
        const sizes = [...new Set(data.variants.map(v => v.size))]

        setSelectedColor(colors[0])

        if (sizes[0]) {
          setSelectedSize(getSizeBucket(sizes[0]) || 'small')
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }

  // Find matching variant
  useEffect(() => {
    if (!selectedColor || !mountedRef.current) return
    
    const variant = variants.find(v =>
      v.color === selectedColor &&
      getSizeBucket(v.size) === selectedSize
    )

    setSelectedVariant(variant || null)
  }, [selectedColor, selectedSize, variants])

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
      size: selectedVariant.size,
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
      
      setTimeout(() => {
        if (mountedRef.current) {
          setAddSuccess(false)
        }
      }, 3000)
    } else if (result.requiresAuth) {
      navigate('/signin')
    }

    setAddingToCart(false)
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    setTimeout(() => navigate('/cart'), 500)
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  const handleSizeChange = (size) => {
    setSelectedSize(size)
  }

  const colors = [...new Set(variants.map(v => v.color))]
  const availableSizes = [...new Set(variants.map(v => v.size).filter(Boolean))]

  if (loading) return <SimpleLoader />

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
    <section className="min-h-screen bg-black text-white py-20">
      <div className="screen-max-width px-5">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 3D Model - Fixed perspective */}
          <div id="product-canvas">
            <div id="product-canvas" ref={canvasContainerRef}>
              <div className="relative w-full h-150 bg-zinc-900 rounded-3xl overflow-hidden">
                {canvasReady ? (
                  <Canvas
                    gl={{
                      antialias: true,
                      alpha: true,
                      powerPreference: 'high-performance',
                    }}
                    dpr={[1, 2]}
                    frameloop="demand"
                    camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 1000 }}
                    onCreated={({ gl }) => {
                      gl.toneMapping = THREE.ACESFilmicToneMapping
                      gl.toneMappingExposure = 1
                    }}
                  >
                    <color attach="background" args={['#18181b']} />
                    <ambientLight intensity={0.4} />
                    <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
                    <Lights />
                    <OrbitControls
                      ref={controlRef}
                      enableZoom={false}
                      enablePan={false}
                      rotateSpeed={0.4}
                      minPolarAngle={Math.PI / 2}
                      maxPolarAngle={Math.PI / 2}
                      target={[0, 0, 0]}
                    />
                    <Suspense fallback={null}>
                      <group position={[0, 0, 0]}>
                        <IPhone
                          scale={selectedSize === 'small' ? [15, 15, 15] : [17, 17, 17]}
                          item={modelItem}
                          size={selectedSize}
                        />
                      </group>
                    </Suspense>
                  </Canvas>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  </div>
                )}

                {addSuccess && (
                  <div
                    id="success-badge"
                    className="absolute top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full opacity-0 shadow-lg z-10 flex items-center gap-2 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Added to cart!
                  </div>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  Drag to rotate
                </div>
              </div>
            </div>
          </div>

          {/* Product Options - All visible by default */}
          <div>
            <h1 id="product-title" className="text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-400 text-lg mb-8">{product.description}</p>

            {/* Price */}
            <div className="mb-8">
              <p className="text-4xl font-bold text-blue-400">
                ₹{formatIndianCurrency(currentPrice)}
              </p>
              {selectedVariant && selectedVariant.price !== product.basePrice && (
                <p className="text-sm text-gray-500">
                  Starting at ₹{formatIndianCurrency(product.basePrice)}
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
                        onClick={() => handleColorChange(color)}
                        className={`group relative w-16 h-16 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/50'
                            : 'border-zinc-700 hover:border-zinc-500 hover:scale-105'
                        }`}
                        aria-label={`Select ${color}`}
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

            {/* Size Selection */}
            {availableSizes.length > 1 && (
              <div className="option-section mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Size: <span className="text-blue-400">{selectedSize === 'small' ? '6.1"' : '6.7"'}</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSizeChange('small')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSize === 'small'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <p className="font-bold text-lg">6.1"</p>
                    <p className="text-sm text-gray-400">iPhone 15 Pro</p>
                  </button>
                  <button
                    onClick={() => handleSizeChange('large')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSize === 'large'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <p className="font-bold text-lg">6.7"</p>
                    <p className="text-sm text-gray-400">iPhone 15 Pro Max</p>
                  </button>
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
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-xl font-bold transition-colors"
                  aria-label="Increase quantity"
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
                    In Stock {selectedVariant.stockCount > 0 && `- ${selectedVariant.stockCount} available`}
                  </p>
                ) : (
                  <p className="text-red-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Out of Stock
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div id="buy-section" className="space-y-4">
              <button
                onClick={handleBuyNow}
                disabled={addingToCart || selectedVariant?.inStock === false}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
              >
                {addingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </span>
                ) : 'Buy Now'}
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || selectedVariant?.inStock === false}
                className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-5 rounded-xl transition-colors"
              >
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="mt-12 pt-8 border-t border-zinc-800">
              <h3 className="text-xl font-semibold mb-4">What's Included</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free shipping on all orders
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  30-day return policy
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  1-year Apple warranty
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  USB-C cable included
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage