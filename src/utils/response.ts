import { Response } from 'express'

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponse['meta']
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  }
  
  if (meta) {
    response.meta = meta
  }
  
  res.status(statusCode).json(response)
}

export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  error?: string
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error }),
  }
  
  res.status(statusCode).json(response)
}
