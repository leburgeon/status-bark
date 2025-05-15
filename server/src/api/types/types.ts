import { z } from 'zod'
import { EncryptedDiscordWebhookObjectSchema, LoginCredentialsSchema, MonitorPatchDataSchema, NewMonitorSchema, NewUserSchema, PartialEncryptedDiscordWebhookObjectSchema, ProcessedMonitorUpdateSchema, UnEncryptedDiscordWebhookObjectSchema } from '../utils/validators.js'

// Type for registering user information
export type NewUser = z.infer<typeof NewUserSchema>

// Type for login credentials
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>

// Type for a new monitor information
export type NewMonitor = z.infer<typeof NewMonitorSchema>

// Type for an unencrypted discord webhook object
export type UnEncryptedDiscordWebhookObject = z.infer<typeof UnEncryptedDiscordWebhookObjectSchema>

// Type for an encrypted discord webhook object
export type EncryptedDiscordWebhookObject = z.infer<typeof EncryptedDiscordWebhookObjectSchema>










// PATCHING A MONITOR

// Type for monitor patch data
export type MonitorPatchData = z.infer<typeof MonitorPatchDataSchema>

// Type for partial monitor update data after encryptions
export type ProcessedMonitorUpdateData = z.infer<typeof ProcessedMonitorUpdateSchema>


// Type for processed discordwebhook patch data (partial)
export type ProcessedDiscordWebhookPatchData = z.infer<typeof PartialEncryptedDiscordWebhookObjectSchema>