import axios from "axios"

// Attempts to register a new user
const registerUser = async (data: {email: string, password: string}): Promise<void> => {
  await axios.post('/api/users/register', data)
}

export default {
  registerUser
}