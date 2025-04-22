import { NextFunction, Request, Response } from 'express'
import { NewUserSchema } from './validators.js'
import { ZodError } from 'zod'
import logger from './logger.js'
import { MongooseError } from 'mongoose'

// Method for parsing new user information from a request body
export const parseNewUser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewUserSchema.parse(req.body)
    next()
  } catch (error) {
    next(error)
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
  }
}