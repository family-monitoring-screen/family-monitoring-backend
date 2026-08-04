import Joi from 'joi'

export const loginValidator = Joi.object({
  firebaseToken: Joi.string().required().messages({
    'string.empty': 'Firebase token is required',
    'any.required': 'Firebase token is required',
  }),
})

export const refreshTokenValidator = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token is required',
    'any.required': 'Refresh token is required',
  }),
})
