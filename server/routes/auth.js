import express from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '../utils/prisma.js'
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js'
import { authMiddleware } from '../middleware/auth.js'
import { sendResetOtpEmail } from '../utils/email.js'

const router = express.Router()
const RESET_OTP_TTL_MS = 10 * 60 * 1000

const generateOtp = () => crypto.randomInt(100000, 999999).toString()

const getPasswordStrength = (password) => {
  if (!password) return 0
  let strength = 0
  if (password.length >= 8) strength += 1
  if (password.length >= 12) strength += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1
  if (/\d/.test(password)) strength += 1
  if (/[^a-zA-Z\d]/.test(password)) strength += 1
  return strength
}

const ensureStrongPassword = (password) => {
  if (!password || password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters' }
  }

  if (getPasswordStrength(password) < 5) {
    return { ok: false, error: 'Password must be very strong' }
  }

  return { ok: true }
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const passwordCheck = ensureStrongPassword(password)
    if (!passwordCheck.ok) {
      return res.status(400).json({ error: passwordCheck.error })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    // Generate token
    const token = generateToken(user.id)
    setAuthCookie(res, token)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Signup failed' })
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user.id)
    setAuthCookie(res, token)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    console.error('Signin error:', error)
    res.status(500).json({ error: 'Signin failed' })
  }
})

// Request password reset OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const otp = generateOtp()
      const resetOtpExpires = new Date(Date.now() + RESET_OTP_TTL_MS)

      await prisma.user.update({
        where: { email },
        data: { resetOtp: otp, resetOtpExpires }
      })

      await sendResetOtpEmail(email, otp)
    }

    res.json({ message: 'If an account exists, an OTP was sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    const errorMessage = error.message.includes('Email service not configured')
      ? 'Email service is not configured. Please contact administrator.'
      : 'Failed to send OTP'
    res.status(500).json({ error: errorMessage })
  }
})

// Reset password with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ error: 'Invalid OTP or email' })
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP or email' })
    }

    if (new Date(user.resetOtpExpires) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' })
    }

    const passwordCheck = ensureStrongPassword(newPassword)
    if (!passwordCheck.ok) {
      return res.status(400).json({ error: passwordCheck.error })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpires: null
      }
    })

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

// Sign Out
router.post('/signout', (req, res) => {
  clearAuthCookie(res)
  res.json({ message: 'Signed out successfully' })
})

// Verify auth status
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router
