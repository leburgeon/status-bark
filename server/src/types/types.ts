import { z } from 'zod'
import { LoginCredentialsSchema, MonitorIntervalUpdateSchema, NewMonitorSchema, NewUserSchema } from '../utils/validators.js'

// Type for registering user information
export type NewUser = z.infer<typeof NewUserSchema>

// Type for login credentials
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>

// Type for a new monitor information
export type NewMonitor = z.infer<typeof NewMonitorSchema>

// Type for a monitor interval update
export type MonitorIntervalUpdate = z.infer<typeof MonitorIntervalUpdateSchema>