import mongoose from "mongoose"
import User from "../src/models/User.js"

const initialUsers: {email: string, password: string}[] = [
  {
    email: 'firstUser@email.com',
    password: 'SuperStrong1!'
  },
  {
    email: 'secondUser@email.com',
    password: 'SuperStrong1'
  }
]

const clearUserData = async () => {
  await User.deleteMany({})
}

export default { clearUserData, initialUsers } 