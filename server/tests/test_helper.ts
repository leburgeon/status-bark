import Monitor from "../src/api/models/Monitor.js"
import User from "../src/api/models/User.js"
import bcrypt from "bcryptjs"
import { generateJsonWebToken } from "../src/api/utils/helpers.js"
import config from "../src/utils/config.js"
import { NewMonitor } from "../src/api/types/types.js"

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
const initialMonitors = [
  {
    nickname: 'google',
    url: 'http://google.com',
    interval: 5,
    discordWebhook: {
      notify: true,
      encryptedUrl: config.TEST_DISCORD_WEBHOOK
    }
  },
  {
    nickname: 'facebook',
    url: 'http://facebook.com',
    interval: 5,
    discordWebhook: {
      notify: true,
      encryptedUrl: config.TEST_DISCORD_WEBHOOK
    }
  },
  {
    nickname: 'notexist',
    url: 'http://alwaysnotthereintime.com',
    interval: 5,
    discordWebhook: {
      notify: true,
      encryptedUrl: config.TEST_DISCORD_WEBHOOK
    }
  }
]

// Monitor info for adding a new monitor
const monitorToAdd = {
  nickname: 'github',
  url: 'http://github.com',
  interval: '5',
  discordWebhook: {
    notify: true,
    unEncryptedWebhook: config.TEST_DISCORD_WEBHOOK
  }
}

// Info for sending a monitor update
const monitorUpdateData = {
  url: 'http://ebay.com',
  interval: '15',
  nickname: 'ebay'
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

// For retrieving a specific user from the database
const getFirstUser = async () =>{
  return await User.findOne({email: initialUsers[0].email})
}

// For retrieving the second user from the database
const getSecondUser = async () =>{
  return await User.findOne({email: initialUsers[1].email})
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

// Helper method for getting a specific monitor by its id
const getMonitorById = async (id: string) => {
  const monitor = await Monitor.findById(id)
  if (!monitor) {
    throw new Error('Error retrieving monitor by id')
  }
  return monitor
}

// For returning a specific monitor of the first user
const getSpecificFirstUserMonitor = async () => {
  const firstUser = await getFirstUser()
  if (!firstUser){
    throw new Error('Error retrieving specific user')
  }
  const monitor = await Monitor.findOne({url: initialMonitors[0].url, user: firstUser._id.toString()})
  if (!monitor){
    throw new Error('Error retrieving monitor')
  }
  return monitor
}

// For returning a specific monitor of the second user
const getSpecificSecondUserMonitor = async () => {
  const secondUser = await getSecondUser()
  if (!secondUser){
    throw new Error('Error retrieving specific user')
  }
  const monitor = await Monitor.findOne({url: initialMonitors[0].url, user: secondUser._id.toString()})
  if (!monitor){
    throw new Error('Error retrieving monitor')
  }
  return monitor
}

// For adding a monitor with the data provided, and then returning the id as a string
const addMonitorWithDataAsFirstUserAndReturnId = async (data: NewMonitor) => {
  const firstUser = await User.findOne({email: initialUsers[0].email})
  const newMonitor = new Monitor({...data, user: firstUser?._id.toString()})
  await newMonitor.save()
  return newMonitor._id.toString()
}

// For getting the login token for the test runner
const getBearerTokenOfFirstUser = async (expiryTimeInSeconds: number) => {
  const { email } = initialUsers[0]
  const firstUser = await User.findOne({email})
  if (!firstUser){
    throw new Error('Error generating auth token: could not find first user')
  }
  return generateJsonWebToken(email, firstUser._id.toString(), expiryTimeInSeconds)
}


export default { 
  initialMonitors,
  monitorToAdd,
  monitorUpdateData,
  clearUserData,
  initialUsers,
  userToAdd,
  usersInDb,
  addInitialUsers,
  clearMonitorData,
  monitorsInDb,
  addInitialMonitors,
  getBearerTokenOfFirstUser,
  getMonitorById,
  getSpecificFirstUserMonitor,
  addMonitorWithDataAsFirstUserAndReturnId,
  getSpecificSecondUserMonitor
 } 