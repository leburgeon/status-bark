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

// Zod schema for en unencrypted discord webhook object
// If notify is true, webhook must be provided or an error is thrown
export const unEncryptedDiscordWebhookObjectSchema = z.object({
  notify: z.boolean(),
  unEncryptedWebhook: z.string().url().optional()
}).refine(val => {
  if (val.notify){
    return val.unEncryptedWebhook !== undefined
  }
  return true
},{message: 'If notify: true, url must be defined'})

// Zod schema for new monitor data recieved from the user, with optional discordWebhook object
export const NewMonitorSchema = z.object({
  url: z.string().url(),
  interval: z.enum(['5', '15', '30']).transform(val => parseInt(val)),
  discordWebhook: unEncryptedDiscordWebhookObjectSchema.optional()
})

// Zod schema for parsing a monitor interval update
export const PartialMonitorSchema = NewMonitorSchema.partial()

// Zod object schema for encrypted discord webhook data
export const encryptedDiscordWebhookObjectSchema = z.object({
  notify: z.boolean(),
  encryptedUrl: z.string().optional()
})

export const PartialEncryptedMonitorUpdateSchema = z.object({
  url: z.string().url(),
  interval: z.enum(['5', '15', '30']).transform(val => parseInt(val)),
  discordWebhook: encryptedDiscordWebhookObjectSchema.optional()
}).partial()