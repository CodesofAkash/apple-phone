import "dotenv/config";
import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data (optional - comment out if you want to keep data)
  await prisma.orderStatusHistory.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  console.log('✅ Cleared existing data')


  const ApplePhone20Pro = await prisma.product.create({
    data: {
      name: 'Apple phone 20 Pro',
      slug: 'apple-phone',
      description: 'The most advanced Apple phone ever. With titanium design, A17 Pro chip, and breakthrough camera capabilities.',
      basePrice: 199999,
      category: 'Apple Phone',
      images: [
        '/assets/images/yellow.jpg',
        '/assets/images/explore1.jpg',
        '/assets/images/explore2.jpg',
      ],
      featured: true,
      inStock: true,
    },
  })

  // iPhone 15 Pro Max
  const ApplePhone20ProMax = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'The ultimate iPhone with the largest display and best battery life. Features titanium design and A17 Pro chip.',
      basePrice: 1199,
      category: 'Apple Phone',
      images: [
        '/assets/images/yellow.jpg',
        '/assets/images/explore1.jpg',
      ],
      featured: true,
      inStock: true,
    },
  })

  console.log('✅ Created products')

  // Color configurations
  const colors = [
    { name: 'Natural Titanium', hex: '#d4c5b0', image: '/assets/images/yellow.jpg' },
    { name: 'Blue Titanium', hex: '#5c7c99', image: '/assets/images/blue.jpg' },
    { name: 'White Titanium', hex: '#f5f5f0', image: '/assets/images/white.jpg' },
    { name: 'Black Titanium', hex: '#3f3f3f', image: '/assets/images/black.jpg' },
  ]

  // Storage options with price increases
  const sizeOptions = [
    { size: '6.1', priceIncrease: 0 },
    { size: '6.7', priceIncrease: 50000 },
  ]

  for (const color of colors) {
    for (const size of sizeOptions) {
      await prisma.productVariant.create({
        data: {
          productId: ApplePhone20Pro.id,
          sku: `IPH20P-${color.name.substring(0, 3).toUpperCase()}-${size.size}`,
          color: color.name,
          colorHex: color.hex,
          storage: size.size,
          size: size.size,
          price: 199999 + size.priceIncrease,
          stockCount: 50,
          inStock: true,
          images: [color.image],
        },
      })
    }
  }

  for (const color of colors) {
    for (const size of sizeOptions) {
      await prisma.productVariant.create({
        data: {
          productId: ApplePhone20ProMax.id,
          sku: `IPH20PM-${color.name.substring(0, 3).toUpperCase()}-${size.size}`,
          color: color.name,
          colorHex: color.hex,
          storage: size.size,
          size: size.size,
          price: 1199 + size.priceIncrease,
          stockCount: 30,
          inStock: true,
          images: [color.image],
        },
      })
    }
  }

  console.log('✅ Created product variants')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
