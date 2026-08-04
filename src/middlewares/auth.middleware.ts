import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { verifyFirebaseToken } from '../config/firebase'
import { sendError } from '../utils/response'
import { User } from '../models/user.model'
import { logger } from '../config/logger'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    firebaseUid: string
    role: string
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication required', 401)
      return
    }
    
    const token = authHeader.split(' ')[1]
    
    if (!token) {
      sendError(res, 'Authentication token is missing', 401)
      return
    }
    
    try {
      // Verify Firebase token
      const decodedFirebase = await verifyFirebaseToken(token)
      
      // Find or create user
      let user = await User.findOne({ firebaseUid: decodedFirebase.uid })
      
      if (!user) {
        user = await User.create({
          firebaseUid: decodedFirebase.uid,
          email: decodedFirebase.email || '',
          displayName: decodedFirebase.name || null,
          photoURL: decodedFirebase.picture || null,
          lastLoginAt: new Date(),
        })
      } else {
        user.lastLoginAt = new Date()
        await user.save()
      }
      
      if (!user.isActive) {
        sendError(res, 'Account is deactivated', 403)
        return
      }
      
      req.user = {
        userId: user._id.toString(),
        email: user.email,
        firebaseUid: user.firebaseUid,
        role: user.role,
      }
      
      next()
    } catch (firebaseError) {
      // Try JWT token as fallback
      try {
        const decoded = verifyAccessToken(token)
        
        const user = await User.findById(decoded.userId)
        
        if (!user || !user.isActive) {
          sendError(res, 'User not found or deactivated', 401)
          return
        }
        
        req.user = {
          userId: user._id.toString(),
          email: user.email,
          firebaseUid: user.firebaseUid,
          role: user.role,
        }
        
        next()
      } catch (jwtError) {
        sendError(res, 'Invalid or expired token', 401)
        return
      }
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error)
    sendError(res, 'Authentication failed', 500)
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401)
      return
    }
    
    if (!roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions', 403)
      return
    }
    
    next()
  }
}
