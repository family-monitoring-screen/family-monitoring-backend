import mongoose from 'mongoose'
import { environment } from './environment'
import { logger } from './logger'

export const connectDatabase = async (): Promise<void> => {
  try {
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: 'majority',
    }

    await mongoose.connect(environment.mongodb.uri, options)
    
    logger.info('✅ MongoDB connected successfully')
    
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error)
    })
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected')
    })
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      logger.info('MongoDB connection closed through app termination')
      process.exit(0)
    })
    
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error)
    throw error
  }
}
