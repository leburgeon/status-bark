import { NextFunction, Request, Response } from 'express'
import { JwtPayloadSchema, LoginCredentialsSchema, NewMonitorSchema, NewUserSchema, MonitorPatchDataSchema, DiscordWebhookPatchDataSchema } from './validators.js'
import { ZodError, ZodSchema } from 'zod'
import logger from '../../utils/logger.js'
import { MongooseError } from 'mongoose'
import jwt from 'jsonwebtoken'
import config from '../../utils/config.js'
import User from '../models/User.js'
import { encryptSymmetricIntoPayload } from '../../utils/helper.js'

// Skeleton method for parsing a request body with a zod schema
const parseRequestBodyWith = (schema: ZodSchema, req: Request, next: NextFunction) => {
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    logger.error('Error parsing request body:', error)
    next(error)
  }
}

// Method for parsing new user information from a request body
export const parseNewUser = (req: Request, _res: Response, next: NextFunction) => {
  parseRequestBodyWith(NewUserSchema, req, next)
}

// For parsing the login credentials from a request body
export const parseLoginCredentials = (req: Request, _res: Response, next: NextFunction) => {
  parseRequestBodyWith(LoginCredentialsSchema, req, next)
}

// For parsing new monitor information from a request body
// If discordWebhook object is defined, validates that notify:true ensures a webhook is provided
export const parseNewMonitor = (req: Request, _res: Response, next: NextFunction) => {
  parseRequestBodyWith(NewMonitorSchema, req, next)
}

// For parsing an update for a monitor
export const parsePartialMontiorPatchData = (req: Request, _res: Response, next: NextFunction) => {
  parseRequestBodyWith(MonitorPatchDataSchema, req, next)
}

// For parsing and processing the discord webhook update. Adding either the encrypted webook, or a null value to the encryptedUrl field.
export const parseAndProcessDiscordWebhookPatchData = (req: Request, _res: Response, next: NextFunction) => {
  // Parses the request body to ensure update values of the correct type
  try {
    DiscordWebhookPatchDataSchema.parse(req.body)
    // Processes the discord webhook url update if present
    if (Object.keys(req.body).includes('unEncryptedWebhook')){
      if (req.body.unEncryptedWebhook){
        req.body.encryptedUrl = encryptSymmetricIntoPayload(req.body.unEncryptedWebhook)
      } else {
        req.body.encryptedUrl = null
      }
    }
    next()
  } catch (error) {
    next(error)
  }
}

// For authenticating a user
export const authenticateAndExtractUser = async (req: Request, res: Response, next: NextFunction) => {
  const authorisation = req.get('Authorization')
  // If the token does not exist or uses the wrong schema, returns error response
  if (!authorisation || !authorisation.startsWith('Bearer')){
    res.status(401).json({error: 'Please authenticate with bearer scheme'})
    return
  } else {
    try {
      // Extracts just the token
      const token = authorisation.replace('Bearer ', '')
      // Verifies the token and ensures not expired, will throw an error if not valid
      const decoded = jwt.verify(token, config.JWT_SECRET)
      // Parses the payload from the decoded token
      const payload = JwtPayloadSchema.parse(decoded)

      // Attempts to find the authenticated user
      const user = await User.findById(payload.id)
      if (!user){
        res.status(401).json({error: 'Invalid token, please re-login'})
        return
      }
      // Adds the use document to the request body
      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  }
}

// Request logger
export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const method = req.method
  const body = req.body
  const path = req.originalUrl
  logger.info(`URL: ${path} Method: ${method} Body: ${JSON.stringify(body)}`)
  next()
}

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error)
  if (error instanceof ZodError){
    res.status(400).json(error)
  } else if (error instanceof MongooseError){
    res.status(500).json(error)
  } else if (error instanceof jwt.JsonWebTokenError) {
    res.status(400).json({error: error})
  } else {
    logger.error('UNHANDLED ERROR IN EXPRESS', error)
    console.error(error)
    res.status(500).json({error: 'Internal Server Error'})
  }
}