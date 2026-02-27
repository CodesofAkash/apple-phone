import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import 'dotenv/config'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import cartRoutes from './routes/cart.js'
import productRoutes from './routes/products.js'
import paymentRoutes from './routes/payment.js'
import orderRoutes from './routes/orders.js'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const app = express()
const PORT = process.env.PORT || 5000

app.set('trust proxy', 1)

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://apple-phone--codesofakash.vercel.app",
]

// CORS first, before helmet
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || origin.endsWith('-codesofakashs-projects.vercel.app')) return callback(null, true)
    console.log("CORS blocked origin:", origin)
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

// Helmet AFTER cors, with crossOriginResourcePolicy disabled
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
}))

app.use(compression({ level: 6, threshold: 0 }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())

// Security headers but NO Cache-Control here
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  })
  next()
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use('/models', express.static(join(__dirname, 'public/models'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.glb')) {
      res.set('Content-Type', 'model/gltf-binary')
      res.set('Cache-Control', 'public, max-age=31536000, immutable')
      res.set('Access-Control-Allow-Origin', '*')
    }
  }
}))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/products', productRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/orders', orderRoutes)

app.get('/api/health', (req, res) => {
  res.set('Cache-Control', 'public, max-age=60')
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
});