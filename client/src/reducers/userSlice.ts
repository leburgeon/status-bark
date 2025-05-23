import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { z } from "zod"
import authService from "../services/authService"
import { handleErrorsMessage } from "./uiSlice"
import { AppDispatch } from '../store' // Adjust the path to your store file

export const UserDataSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  token: z.string()
})

export type UserData = z.infer<typeof UserDataSchema>

export interface UserState {user?: UserData, loggedIn: boolean}

const userSlice = createSlice({
  name: 'user',
  initialState: authService.getUserFromLocal(),
  reducers: {
    setUserState: (state, action: PayloadAction<{email: string, token: string, id: string}>) => {
      const {email, token, id} = action.payload
      state.user = {email, token, id}
      state.loggedIn = true
    },
    clearUserState: (state) => {
      state.loggedIn = false
      state.user = undefined
    }
  }
})

export const { setUserState, clearUserState } = userSlice.actions

export default userSlice.reducer

// Thunk for attempting to log a user in with credentials
export const login = (credentials: {email: string, password: string}) => {
  return async (dispatch: AppDispatch) => {
    try {
      const userData = await authService.authenticate(credentials)
      dispatch(setUserState(userData))
    } catch (error) {
      console.error(error)
      dispatch(handleErrorsMessage(error))
    }
  }
}

// Thunk for logging a user out including clearing local storage and auth data
export const logout = () => {
  return (dispatch: AppDispatch) => {
    authService.clearAuthData()
    dispatch(clearUserState())
  }
}
