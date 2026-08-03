import { httpServer } from './app'
import { connectDatabase } from './config/database'
import { environment } from './config/environment'
import { logger } from './config/logger'

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase()
    
    // Start server
    httpServer.listen(environment.port, () => {
      logger.info(`✅ Server running on port ${environment.port}`)
      logger.info(`📝 Environment: ${environment.nodeEnv}`)
      logger.info(`🔗 Frontend URL: ${environment.frontendUrl}`)
    })
    
    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received: closing HTTP server`)
      httpServer.close(() => {
        logger.info('HTTP server closed')
        process.exit(0)
      })
    }
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
    
    // Unhandled errors
    process.on('unhandledRejection', (reason: Error) => {
      logger.error('Unhandled Rejection:', reason)
    })
    
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error)
      process.exit(1)
    })
    
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
