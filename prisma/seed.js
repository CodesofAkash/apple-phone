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

  // iPhone 15 Pro
  const iphone15Pro = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'The most advanced iPhone ever. With titanium design, A17 Pro chip, and breakthrough camera capabilities.',
      basePrice: 999,
      category: 'iPhone',
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
  const iphone15ProMax = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'The ultimate iPhone with the largest display and best battery life. Features titanium design and A17 Pro chip.',
      basePrice: 1199,
      category: 'iPhone',
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
  const storageOptions = [
    { size: '128GB', priceIncrease: 0 },
    { size: '256GB', priceIncrease: 100 },
    { size: '512GB', priceIncrease: 300 },
    { size: '1TB', priceIncrease: 500 },
  ]

  // Create variants for iPhone 15 Pro (6.1")
  for (const color of colors) {
    for (const storage of storageOptions) {
      await prisma.productVariant.create({
        data: {
          productId: iphone15Pro.id,
          sku: `IPH15P-${color.name.substring(0, 3).toUpperCase()}-${storage.size}`,
          color: color.name,
          colorHex: color.hex,
          storage: storage.size,
          size: '6.1"',
          price: 999 + storage.priceIncrease,
          stockCount: 50,
          inStock: true,
          images: [color.image],
        },
      })
    }
  }

  // Create variants for iPhone 15 Pro Max (6.7")
  for (const color of colors) {
    for (const storage of storageOptions) {
      await prisma.productVariant.create({
        data: {
          productId: iphone15ProMax.id,
          sku: `IPH15PM-${color.name.substring(0, 3).toUpperCase()}-${storage.size}`,
          color: color.name,
          colorHex: color.hex,
          storage: storage.size,
          size: '6.7"',
          price: 1199 + storage.priceIncrease,
          stockCount: 30,
          inStock: true,
          images: [color.image],
        },
      })
    }
  }

  console.log('✅ Created product variants')

  // Create some additional products
  const products = [
    {
      name: 'iPhone 15',
      slug: 'iphone-15',
      description: 'The new iPhone 15. Dynamic Island. 48MP camera. All-day battery life.',
      basePrice: 799,
      category: 'iPhone',
      images: ['/assets/images/yellow.jpg'],
      featured: false,
    },
    {
      name: 'MacBook Pro 14"',
      slug: 'macbook-pro-14',
      description: 'Supercharged by M3 Pro or M3 Max. Up to 22 hours of battery life.',
      basePrice: 1999,
      category: 'Mac',
      images: ['/assets/images/yellow.jpg'],
      featured: false,
    },
    {
      name: 'iPad Pro',
      slug: 'ipad-pro',
      description: 'The ultimate iPad experience with M2 chip and Liquid Retina XDR display.',
      basePrice: 1099,
      category: 'iPad',
      images: ['/assets/images/yellow.jpg'],
      featured: false,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('✅ Created additional products')
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
