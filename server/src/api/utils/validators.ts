import { z } from 'zod'
import mongoose from 'mongoose'

// Zod schema for the information for registering a new user
export const NewUserSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(5)
})

// Zod schema for parsing login information
export const LoginCredentialsSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string()
})

// Schema for a mongodb documentId
export const ObjectIdSchema = z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId'
})

// Zod schema for parsing a jwt payload
export const JwtPayloadSchema = z.object({
  id: ObjectIdSchema,
  email: z.string().email()
})

// Zod schema for a new monitor
export const NewMonitorSchema = z.object({
  url: z.string().url(),
  interval: z.enum(['5', '15', '30'])
})

// Zod schema for parsing a monitor interval update
export const MonitorIntervalUpdateSchema = z.object({
  id: ObjectIdSchema,
  interval: z.enum(['5', '15', '30'])
})