import axios from "axios"
import { apiRequest } from "../utils/api"

const registerUser = async (data: {email: string, password: string}): Promise<void> => {
  await apiRequest(async () => axios.post('/api/users/register', data))
}

export default {
  registerUser
}