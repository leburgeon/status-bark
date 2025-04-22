import { z } from 'zod'
import { NewUserSchema } from './utils/validators.js'

// Type for a new user to register
export type NewUser = z.infer<typeof NewUserSchema>