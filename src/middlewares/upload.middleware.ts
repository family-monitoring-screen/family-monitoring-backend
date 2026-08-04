import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { environment } from '../config/environment'
import { sendError } from '../utils/response'
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, environment.upload.path)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed'))
  }
}

export const uploadScreenshot = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: environment.upload.maxFileSize,
  },
}).single('screenshot')
