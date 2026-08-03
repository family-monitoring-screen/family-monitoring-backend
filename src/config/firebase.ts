import * as admin from 'firebase-admin'
import { environment } from './environment'
import { logger } from './logger'

let firebaseApp: admin.app.App

export const initializeFirebase = (): admin.app.App => {
  try {
    if (!firebaseApp) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: environment.firebase.projectId,
          clientEmail: environment.firebase.clientEmail,
          privateKey: environment.firebase.privateKey,
        }),
      })
      
      logger.info('✅ Firebase Admin SDK initialized successfully')
    }
    
    return firebaseApp
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK:', error)
    throw error
  }
}

export const getFirebaseAuth = (): admin.auth.Auth => {
  return admin.auth()
}

export const verifyFirebaseToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    const decodedToken = await getFirebaseAuth().verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    logger.error('Firebase token verification failed:', error)
    throw new Error('Invalid or expired Firebase token')
  }
}
