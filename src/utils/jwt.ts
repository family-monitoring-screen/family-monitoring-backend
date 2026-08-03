import jwt from 'jsonwebtoken'
import { environment } from '../config/environment'

interface TokenPayload {
  userId: string
  email: string
  firebaseUid: string
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, environment.jwt.secret, {
    expiresIn: environment.jwt.expiresIn,
  } as jwt.SignOptions)
}

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, environment.jwt.refreshSecret, {
    expiresIn: environment.jwt.refreshExpiresIn,
  } as jwt.SignOptions)
}

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, environment.jwt.secret) as TokenPayload
  } catch (error) {
    throw new Error('Invalid or expired access token')
  }
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, environment.jwt.refreshSecret) as TokenPayload
  } catch (error) {
    throw new Error('Invalid or expired refresh token')
  }
}
