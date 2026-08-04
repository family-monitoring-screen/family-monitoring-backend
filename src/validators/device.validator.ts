import Joi from 'joi'

export const generateLinkValidator = Joi.object({
  expiryHours: Joi.number().min(1).max(72).default(24),
})

export const approveDeviceValidator = Joi.object({
  token: Joi.string().required(),
  deviceName: Joi.string().min(2).max(100).required(),
  deviceModel: Joi.string().min(1).max(100).required(),
  os: Joi.string().min(1).max(50).required(),
  osVersion: Joi.string().max(50).default('Unknown'),
  deviceId: Joi.string().required(),
})

export const removeDeviceValidator = Joi.object({
  deviceId: Joi.string().required(),
})
