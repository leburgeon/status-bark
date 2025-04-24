import User from "../src/models/User.js"
import bcrypt from "bcryptjs"

// Initial users to add to the database
const initialUsers: {email: string, password: string}[] = [
  {
    email: 'firstUser@email.com',
    password: 'SuperStrong1!'
  },
  {
    email: 'secondUser@email.com',
    password: 'SuperStrong1!'
  }
]

// User info for adding a user
const userToAdd = {
  email: 'userToAdd@email.com',
  password: 'SuperStrong1!'
}

// For initialising the users
const addInitialUsers = async () => {
  const passwordHash = await bcrypt.hash('SuperStrong1!', 8)
  const promises = initialUsers.map(data => {
    const newUser = new User({email: data.email, passwordHash})
    return newUser.save()
  })
  Promise.all(promises)
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
  usersInDb,
  addInitialUsers
 } 