import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}

// ==================== PRODUCTS ROUTES ====================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured } = req.query
    
    const where = {}
    if (category) where.category = category
    if (featured === 'true') where.featured = true
    
    const products = await prisma.product.findMany({
      where,
      include: {
        variants: {
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Get product by slug with variants
app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    
    const product = await prisma.product.findUnique({
      where: { slug },
    })
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    const variants = await prisma.productVariant.findMany({
      where: { productId: product.id },
      orderBy: [
        { color: 'asc' },
        { storage: 'asc' },
      ],
    })
    
    res.json({ product, variants })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// ==================== CART ROUTES ====================

// Get user's cart
app.get('/api/cart', requireAuth, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.session.userId },
      include: {
        product: true,
      },
    })
    
    res.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
})

// Add item to cart
app.post('/api/cart', requireAuth, async (req, res) => {
  try {
    const { productId, quantity, variantId, color, storage, size, price } = req.body
    
    // Check if item already exists
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: req.session.userId,
        productId,
        variantId,
      },
    })
    
    if (existing) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      })
      return res.json(updated)
    }
    
    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: req.session.userId,
        productId,
        variantId,
        quantity,
        color,
        storage,
        size,
        price,
      },
      include: { product: true },
    })
    
    res.json(cartItem)
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ error: 'Failed to add to cart' })
  }
})

// Update cart item quantity
app.put('/api/cart/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { quantity } = req.body
    
    const cartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    })
    
    res.json(cartItem)
  } catch (error) {
    console.error('Error updating cart:', error)
    res.status(500).json({ error: 'Failed to update cart' })
  }
})

// Remove item from cart
app.delete('/api/cart/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.cartItem.delete({
      where: { id },
    })
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error removing from cart:', error)
    res.status(500).json({ error: 'Failed to remove from cart' })
  }
})

// Clear cart
app.post('/api/cart/clear', requireAuth, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.session.userId },
    })
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error clearing cart:', error)
    res.status(500).json({ error: 'Failed to clear cart' })
  }
})

// ==================== ORDER ROUTES ====================

// Create order
app.post('/api/orders', requireAuth, async (req, res) => {
  try {
    const { items, shippingAddress, total, subtotal, tax, shipping } = req.body
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Create order with items and address
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.session.userId,
        total,
        subtotal: subtotal || total,
        tax: tax || 0,
        shipping: shipping || 0,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            color: item.color,
            storage: item.storage,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        shippingAddress: {
          create: {
            userId: req.session.userId,
            fullName: shippingAddress.fullName,
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country || 'United States',
            phone: shippingAddress.phone,
          },
        },
        statusHistory: {
          create: {
            status: 'CONFIRMED',
            notes: 'Order confirmed and payment received',
          },
        },
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    })
    
    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: req.session.userId },
    })
    
    res.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Get order by order number
app.get('/api/orders/:orderNumber', requireAuth, async (req, res) => {
  try {
    const { orderNumber } = req.params
    
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId: req.session.userId,
      },
      include: {
        items: true,
        shippingAddress: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    
    res.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Get all user orders
app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.session.userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    
    res.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Update order status
app.patch('/api/orders/:orderNumber/status', requireAuth, async (req, res) => {
  try {
    const { orderNumber } = req.params
    const { status } = req.body
    
    const order = await prisma.order.update({
      where: { orderNumber },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            notes: `Status updated to ${status}`,
          },
        },
      },
      include: {
        items: true,
        shippingAddress: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    
    res.json(order)
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // In production, use proper password hashing (bcrypt)
    const user = await prisma.user.findUnique({
      where: { email },
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    req.session.userId = user.id
    res.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    res.clearCookie('connect.sid')
    res.json({ success: true })
  })
})

// Get current user
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { id: true, email: true, name: true },
    })
    
    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Database connected`)
})
