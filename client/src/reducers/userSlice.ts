import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { z } from "zod"
import authService from "../services/authService"

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
export const login = (credentials: {username: string, password: string}) => {
  return async (dispatch) => {
    try {
      authService.authenticate(credentials)
    }
  }
}

// Function for logging a user out including clearing local storage