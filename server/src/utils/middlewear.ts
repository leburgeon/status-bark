import { NextFunction, Request, Response } from 'express'
import { JwtPayloadSchema, LoginCredentialsSchema, NewUserSchema } from './validators.js'
import { ZodError, ZodSchema } from 'zod'
import logger from './logger.js'
import { MongooseError } from 'mongoose'
import jwt from 'jsonwebtoken'
import config from './config.js'
import User from '../models/User.js'

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
  logger.info(`URL: ${path} Method: ${method} Body: ${body}`)
  next()
}

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError){
    logger.error('There was a zod error', error.issues)
    res.status(400).json(error)
  } else if (error instanceof MongooseError){
    logger.error(`Mongoose error: ${error.message}`, error)
    res.status(500).json(error)
  } else {
    logger.error('UNHANDLED ERROR IN EXPRESS', error)
    res.status(500).json({error: 'Internal Server Error'})
  }
}