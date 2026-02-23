import express from 'express'
import { prisma } from '../utils/prisma.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        addresses: true,
        orders: {
          include: {
            items: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(email && { email })
      }
    })

    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

router.get('/addresses', authMiddleware, async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    res.json(addresses)
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
    res.status(500).json({ error: 'Failed to fetch addresses' })
  }
})

router.post('/addresses', authMiddleware, async (req, res) => {
  try {
    const { fullName, street, city, state, zipCode, country, phone, isDefault } = req.body

    if (!fullName || !street || !city || !state || !zipCode) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const address = await prisma.address.create({
      data: {
        userId: req.userId,
        fullName,
        street,
        city,
        state,
        zipCode,
        country: country || 'United States',
        phone,
        isDefault: isDefault || false
      }
    })

    res.status(201).json(address)
  } catch (error) {
    console.error('Failed to create address:', error)
    res.status(500).json({ error: 'Failed to create address' })
  }
})

router.put('/addresses/:addressId', authMiddleware, async (req, res) => {
  try {
    const { addressId } = req.params
    const { fullName, street, city, state, zipCode, country, phone, isDefault } = req.body

    // Verify address belongs to user
    const address = await prisma.address.findUnique({
      where: { id: addressId }
    })

    if (!address || address.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        ...(fullName && { fullName }),
        ...(street && { street }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(country && { country }),
        ...(phone && { phone }),
        ...(typeof isDefault !== 'undefined' && { isDefault })
      }
    })

    res.json(updatedAddress)
  } catch (error) {
    console.error('Failed to update address:', error)
    res.status(500).json({ error: 'Failed to update address' })
  }
})

router.delete('/addresses/:addressId', authMiddleware, async (req, res) => {
  try {
    const { addressId } = req.params

    // Verify address belongs to user
    const address = await prisma.address.findUnique({
      where: { id: addressId }
    })

    if (!address || address.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await prisma.address.delete({
      where: { id: addressId }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Failed to delete address:', error)
    res.status(500).json({ error: 'Failed to delete address' })
  }
})

export default router
