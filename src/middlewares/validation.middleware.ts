import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { sendError } from '../utils/response'

export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    })
    
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ')
      
      sendError(res, errorMessage, 400)
      return
    }
    
    next()
  }
}
