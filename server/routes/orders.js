import express from 'express'
import { prisma } from '../utils/prisma.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Create order
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { items, total, shippingInfo, paymentIntentId, saveAddress } = req.body
    const userId = req.userId

    console.log('=== ORDER CREATION REQUEST ===')
    console.log('saveAddress value:', saveAddress)
    console.log('saveAddress type:', typeof saveAddress)
    console.log('saveAddress === true:', saveAddress === true)
    console.log('Full request body:', { items: items?.length, total, paymentIntentId, saveAddress })
    console.log('============================')

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' })
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' })
    }

    if (!shippingInfo) {
      return res.status(400).json({ error: 'Shipping information required' })
    }

    const orderItems = items.map((item) => {
      const unitPrice = Number(item.price || item.product?.basePrice || 0)
      return {
        productId: item.productId || item.product?.id,
        quantity: item.quantity,
        price: unitPrice,
        productName: item.product?.name || item.productName || 'Unknown Product',
        productImage: item.product?.images?.[0] || item.productImage || null
      }
    })

    if (orderItems.some(item => !item.productId || !Number.isFinite(item.price))) {
      return res.status(400).json({ error: 'Invalid order items' })
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const parsedTotal = Number(total)
    const finalTotal = Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : subtotal
    const tax = Math.max(0, finalTotal - subtotal)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order with items and address in a transaction
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        tax,
        total: finalTotal,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'card',
        stripePaymentId: paymentIntentId,
        // Create order items
        items: {
          createMany: {
            data: orderItems
          }
        }
      },
      include: {
        items: true
      }
    })

    // Only create/save address if user explicitly requested to save it
    let shippingAddressId = null
    let billingAddressId = null

    console.log('Checking saveAddress condition: saveAddress === true =', saveAddress === true)
    
    if (saveAddress === true) {
      console.log('✓✓✓ User requested to save address - CHECKING FOR DUPLICATES ✓✓✓')
      
      // Check if this EXACT address already exists for this user (all fields must match)
      const existingAddress = await prisma.address.findFirst({
        where: {
          userId,
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone || null,
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country || 'United States'
        }
      })

      if (existingAddress) {
        console.log('📌 Found exact duplicate address - reusing ID:', existingAddress.id)
        shippingAddressId = existingAddress.id
        billingAddressId = existingAddress.id
      } else {
        console.log('✨ No exact match found (at least one field is different) - creating new address')
        const address = await prisma.address.create({
          data: {
            userId,
            fullName: shippingInfo.fullName,
            phone: shippingInfo.phone,
            street: shippingInfo.street,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country || 'United States',
            isDefault: false
          }
        })
        console.log('Address created with ID:', address.id)
        shippingAddressId = address.id
        billingAddressId = address.id
      }
    } else {
      console.log('✗✗✗ User did NOT request to save address - SKIPPING ADDRESS ✗✗✗')
    }

    // Update order with shipping/billing address (if address was created)
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        ...(shippingAddressId && { shippingAddressId }),
        ...(billingAddressId && { billingAddressId })
      },
      include: {
        items: true,
        shippingAddress: true
      }
    })

    // Create initial status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'CONFIRMED',
        notes: 'Order confirmed and payment received'
      }
    })

    res.status(201).json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        total: updatedOrder.total,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        createdAt: updatedOrder.createdAt
      }
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({ error: error.message || 'Failed to create order' })
  }
})

// Get order by ID
router.get('/details/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params
    const userId = req.userId

    console.log('Fetching order details for orderId:', orderId)
    console.log('User ID:', userId)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        statusHistory: true
      }
    })

    console.log('Order found:', order ? 'YES' : 'NO')

    if (!order) {
      console.log('Order not found in database')
      return res.status(404).json({ error: 'Order not found' })
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      console.log('Order belongs to different user')
      return res.status(403).json({ error: 'Unauthorized' })
    }

    console.log('Returning order:', order.orderNumber)
    res.json(order)
  } catch (error) {
    console.error('Order fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Get order by order number (kept for backward compatibility)
router.get('/:orderNumber', authMiddleware, async (req, res) => {
  try {
    const { orderNumber } = req.params
    const userId = req.userId

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        shippingAddress: true,
        statusHistory: true
      }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    res.json(order)
  } catch (error) {
    console.error('Order fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Get user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        statusHistory: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Update order status (for fake shipping progression)
router.put('/:orderId/status', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const userId = req.userId

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    // Verify order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: true,
        shippingAddress: true,
        statusHistory: true
      }
    })

    // Create status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        notes: `Order status updated to ${status}`
      }
    })

    res.json(updatedOrder)
  } catch (error) {
    console.error('Order status update error:', error)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

export default router
