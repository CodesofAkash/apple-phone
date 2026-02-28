import express from 'express'
import { prisma } from '../utils/prisma.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

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

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, variantId } = req.body

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity required' })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return res.status(404).json({ error: 'Product not found' })

    let variant = null
    if (variantId) {
      variant = await prisma.productVariant.findUnique({ where: { id: variantId } })
      if (!variant || variant.productId !== productId) {
        return res.status(400).json({ error: 'Invalid product variant' })
      }
    }

    const cartPrice = variant ? variant.price : product.basePrice

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId: req.userId,
          productId,
          variantId: variant?.id || null
        }
      }
    })

    let cartItem

    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.userId,
          productId,
          variantId: variant?.id || null,
          color: variant?.color || null,
          storage: variant?.storage || null,
          size: variant?.size || null,
          price: cartPrice,
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

router.put('/:cartItemId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body
    const { cartItemId } = req.params

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' })
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId, userId: req.userId },
      data: { quantity },
      include: { product: true }
    })

    res.json(cartItem)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' })
  }
})

router.delete('/:cartItemId', authMiddleware, async (req, res) => {
  try {
    await prisma.cartItem.delete({
      where: { id: req.params.cartItemId, userId: req.userId }
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' })
  }
})

router.post('/clear', authMiddleware, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.userId } })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' })
  }
})

export default router