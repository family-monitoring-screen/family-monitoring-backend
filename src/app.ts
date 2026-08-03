import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { environment } from './config/environment'
import { initializeFirebase } from './config/firebase'
import { errorHandler } from './middlewares/errorHandler.middleware'
import { initializeSocket } from './socket'
import routes from './routes'
import { logger } from './config/logger'

// Initialize Firebase
initializeFirebase()

const app = express()
const httpServer = createServer(app)

// Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: environment.frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
})

initializeSocket(io)

// Security Middleware
app.use(helmet())
app.use(cors({
  origin: environment.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate Limiting
app.use('/api/', require('./middlewares/rateLimiter.middleware').default)

// Body Parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Data Sanitization
app.use(mongoSanitize())
app.use(xss())

// Compression
app.use(compression())

// Logging
if (environment.nodeEnv === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Static Files
app.use('/uploads', express.static('uploads'))

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  })
})

// API Routes
app.use('/api/v1', routes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error Handler
app.use(errorHandler)

export { app, httpServer, io }
