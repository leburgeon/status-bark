import { z } from 'zod'

export const NewUserSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(5)
})