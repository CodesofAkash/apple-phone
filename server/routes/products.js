import express from 'express'
import { prisma } from '../utils/prisma.js'

const router = express.Router()

router.get('/featured', async (_req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        category: 'apple phone',
        inStock: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'No featured product available' })
    }

    res.json(product)
  } catch (error) {
    console.error('Featured product error:', error)
    res.status(500).json({ error: 'Failed to load product' })
  }
})


router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query
    
    const where = {}
    if (category) where.category = category
    if (featured === 'true') where.featured = true
    
    const products = await prisma.product.findMany({
      where,
      include: {
        variants: {
          take: 1, // Just get one variant for preview
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
        { storage: 'asc' },
      ],
    })
    
    res.json({ product, variants })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// GET /api/products/:id/variants - Get all variants for a product
router.get('/:id/variants', async (req, res) => {
  try {
    const { id } = req.params
    
    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
      orderBy: [
        { color: 'asc' },
        { storage: 'asc' },
      ],
    })
    
    res.json(variants)
  } catch (error) {
    console.error('Error fetching variants:', error)
    res.status(500).json({ error: 'Failed to fetch variants' })
  }
})

export default router
