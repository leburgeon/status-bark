import axios from "axios"
import { UserState, UserDataSchema, UserData } from "../reducers/userSlice"

// Method for setting the global authorisation token under the bearer schema
const setGlobalAxiosAuthToken = (token:string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Method for clearing the global auth token
const clearGlobalAxiosAuthToken = () => {
  delete axios.defaults.headers.common['Authorization']
}

// Method for returning parsed user data from local storagee
const getUserFromLocal = (): UserState => {

  // Gets the json data from local
  const userFromLocal = window.localStorage.getItem('status-bark-user')

  // If null, returns
  if (!userFromLocal){
    return {loggedIn: false}
  }

  try {
    // Parses the local user data
    const userData = UserDataSchema.parse(JSON.parse(userFromLocal))

    // Sets the authorisation header for the axios lib
    setGlobalAxiosAuthToken(userData.token)

    // Then returns the user data
    return {user: userData, loggedIn: true}

  } catch {
    window.localStorage.removeItem('status-bark-user')
    clearGlobalAxiosAuthToken()
    return {loggedIn: false}
  }
}

// Method for attempting to authenticate a user and set the global auth token
const authenticate = async (credentials: {email: string, password: string}):Promise<UserData> => {
  const {data} = await axios.post('/api/users/login', credentials)
  const userData = UserDataSchema.parse(data)
  setGlobalAxiosAuthToken(userData.token)
  window.localStorage.setItem('status-bark-user', JSON.stringify(userData))
  return userData
}

// Method for logging a user out, including claring any local user data and auth tokens
const clearAuthData = () => {
  window.localStorage.removeItem('status-bark-user')
  clearGlobalAxiosAuthToken()
}

export default {
  authenticate,
  getUserFromLocal,
  clearAuthData
}