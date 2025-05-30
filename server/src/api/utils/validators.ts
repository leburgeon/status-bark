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





// ADDING A NEW MONITOR

// Zod schema for an unencrypted discord webhook object
// If notify is true, webhook must be provided or an error is thrown
export const UnEncryptedDiscordWebhookObjectSchema = z.object({
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
  nickname: z.string().min(3),
  url: z.string().url(),
  interval: z.enum(['5', '15', '30']).transform(val => parseInt(val)),
  discordWebhook: UnEncryptedDiscordWebhookObjectSchema.optional()
})






// Zod object schema for encrypted discord webhook data
export const EncryptedDiscordWebhookObjectSchema = z.object({
  notify: z.boolean(),
  encryptedUrl: z.string().optional()
})

// Zod object schema for the processed discord webhook update schema 
export const PartialEncryptedDiscordWebhookObjectSchema = EncryptedDiscordWebhookObjectSchema.partial()


// PATCHING AN EXISTING MONITOR

// Zod schema for parsing discord webhook patch data
export const DiscordWebhookPatchDataSchema = z.object({
  notify: z.boolean(),
  unEncryptedWebhook: z.string().url().or(z.null())
}).partial()

// Zod schema for parsing monitor patch data
export const MonitorPatchDataSchema = z.object({
  nickname: z.string().min(3).max(25),
  url: z.string().url(),
  interval: z.enum(['5', '15', '30']).transform(val => parseInt(val))
}).partial()


export const ProcessedMonitorUpdateSchema = z.object({
  nickname: z.string().min(3).max(25),
  url: z.string().url(),
  interval: z.enum(['5', '15', '30']).transform(val => parseInt(val)),
  discordWebhook: EncryptedDiscordWebhookObjectSchema.partial()
}).partial()