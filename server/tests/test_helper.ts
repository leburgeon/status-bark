import User from "../src/models/User.js"
import bcrypt from "bcryptjs"

// Password hash for initial users
const passwordHash = await bcrypt.hash('SuperStrong1!', 8)

// Initial users to add to the database
const initialUsers: {email: string, passwordHash: string}[] = [
  {
    email: 'firstUser@email.com',
    passwordHash
  },
  {
    email: 'secondUser@email.com',
    passwordHash
  }
]

// User info for adding a user
const userToAdd = {
  email: 'userToAdd@email.com',
  password: 'SuperStrong1!'
}

// For clearing the user data from the database
const clearUserData = async () => {
  await User.deleteMany({})
}

// For retrieving the users from the database
const usersInDb = async () => {
  return await User.find({})
}

export default { 
  clearUserData,
  initialUsers,
  userToAdd,
  usersInDb
 } 