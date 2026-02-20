import express from 'express'
import { prisma } from '../utils/prisma.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Get cart for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: true }
    })
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
})

// Add item to cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity required' })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.userId,
          productId
        }
      }
    })

    let cartItem

    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.userId,
          productId,
          quantity
        },
        include: { product: true }
      })
    }

    res.json(cartItem)
  } catch (error) {
    console.error('Cart add error:', error)
    res.status(500).json({ error: 'Failed to add to cart' })
  }
})

// Update cart item quantity
router.put('/:cartItemId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body
    const { cartItemId } = req.params

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' })
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
        userId: req.userId
      },
      data: { quantity },
      include: { product: true }
    })

    res.json(cartItem)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' })
  }
})

// Remove item from cart
router.delete('/:cartItemId', authMiddleware, async (req, res) => {
  try {
    const { cartItemId } = req.params

    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
        userId: req.userId
      }
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' })
  }
})

// Clear entire cart
router.post('/clear', authMiddleware, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.userId }
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' })
  }
})

export default router
