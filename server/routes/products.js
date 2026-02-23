import express from 'express'
import { prisma } from '../utils/prisma.js'

const router = express.Router()

// GET /api/products/:slug - Get product by slug with all variants
router.get('/:slug', async (req, res) => {
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
        { size: 'asc' },
      ],
    })
    
    res.json({ product, variants })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
