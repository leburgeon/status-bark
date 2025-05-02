import { z } from 'zod'
import { LoginCredentialsSchema, NewMonitorSchema, NewUserSchema, PartialEncryptedMonitorUpdateSchema, PartialMonitorSchema } from '../utils/validators.js'

// Type for registering user information
export type NewUser = z.infer<typeof NewUserSchema>

// Type for login credentials
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>

// Type for a new monitor information
export type NewMonitor = z.infer<typeof NewMonitorSchema>

// Type for a monitor interval update
export type PartialMonitorUpdate = z.infer<typeof PartialMonitorSchema>

// Type for partial monitor update data after encryptions
export type PartialEncryptedMonitorUpdate = z.infer<typeof PartialEncryptedMonitorUpdateSchema>