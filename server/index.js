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

const app = express()
const PORT = process.env.PORT || 5000

app.set('trust proxy', 1)

app.use(helmet())
app.use(compression({
  level: 6,
  threshold: 0,
}))

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())

app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  })
  next()
})

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
