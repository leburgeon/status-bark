import axios from "axios"
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  userId: z.string(),
  token: z.string()
})

const authenticate = async (credentials: {username: string, password: string}):Promise<{email: string, userId: string, token: string}> => {
  const {data} = await axios.post('/api/users/login', credentials)
  const userData = userSchema.parse(data)
  return userData
}

export default {authenticate}