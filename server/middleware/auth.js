import { verifyTokenWithCode } from '../utils/jwt.js'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No authentication token', code: 'TOKEN_MISSING' })
    }

    const { decoded, errorCode } = verifyTokenWithCode(token)

    if (!decoded) {
      const message = errorCode === 'TOKEN_EXPIRED' ? 'Token expired' : 'Invalid token'
      return res.status(401).json({ error: message, code: errorCode || 'TOKEN_INVALID' })
    }

    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}
