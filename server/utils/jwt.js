import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRY = '6h'
const AUTH_COOKIE_NAME = 'auth_token'
const AUTH_COOKIE_MAX_AGE = 6 * 60 * 60 * 1000

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const verifyTokenWithCode = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { decoded, errorCode: null }
  } catch (error) {
    if (error?.name === 'TokenExpiredError') {
      return { decoded: null, errorCode: 'TOKEN_EXPIRED' }
    }
    return { decoded: null, errorCode: 'TOKEN_INVALID' }
  }
}

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: AUTH_COOKIE_MAX_AGE
  })
}

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}
