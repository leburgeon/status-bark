import Monitor from "../src/models/Monitor.js"
import User from "../src/models/User.js"
import bcrypt from "bcryptjs"
import { generateJsonWebToken } from "../src/utils/helpers.js"

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


// Inital monitor data
const initialMonitors: {url: string, interval: number}[] = [
  {
    url: 'http://google.com',
    interval: 5
  },
  {
    url: 'http://facebook.com',
    interval: 15
  },
  {
    url: 'http://alwaysnotthereintime.com',
    interval: 15
  }
]

// Monitor info for adding a new monitor
const monitorToAdd = {
  url: 'http://github.com',
  interval: 5
}


// For initialising the users
const addInitialUsers = async () => {
  const passwordHash = await bcrypt.hash('SuperStrong1!', 8)
  const promises = initialUsers.map(data => {
    const newUser = new User({email: data.email, passwordHash})
    return newUser.save()
  })
  await Promise.all(promises)
}

// For clearing the user data from the database
const clearUserData = async () => {
  await User.deleteMany({})
}

// For retrieving the users from the database
const usersInDb = async () => {
  return await User.find({})
}

// For clearing the monitors from the database
const clearMonitorData = async () => {
  await Monitor.deleteMany({})
}

// For initialising initial users with monitors
const addInitialMonitors = async () => {
  const firstUser = await User.findOne({email: initialUsers[0].email})
  await Monitor.insertMany(initialMonitors.map(monitor => {
    return {...monitor, user: firstUser?._id.toString()}
  }))
  const secondUser = await User.findOne({email: initialUsers[1].email})
  await Monitor.insertMany(initialMonitors.map(monitor => {
    return {...monitor, user: secondUser?._id.toString()}
  }))
}

// For retrieving all the monitors currently in the database
const monitorsInDb = async () => {
  const monitors = await Monitor.find({})
  if (monitors.length <= 0){
    throw new Error('Error retrieving monitors from the database')
  }
  return monitors
}



// For setting the login token for the test runner
const getBearerToken = async () => {
  const { email } = initialUsers[0]
  const firstUser = await User.findOne({email})
  if (!firstUser){
    throw new Error('Error generating auth token: could not find first user')
  }
  return generateJsonWebToken(email, firstUser._id.toString(), 60*60)
}


export default { 
  initialMonitors,
  monitorToAdd,
  clearUserData,
  initialUsers,
  userToAdd,
  usersInDb,
  addInitialUsers,
  clearMonitorData,
  monitorsInDb,
  addInitialMonitors,
  getBearerToken
 } 