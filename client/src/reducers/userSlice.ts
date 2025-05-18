import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface userState {
  loggedIn: boolean,
  user?: {
    id: string,
    email: string,
    token: string
  }
}

const initialState: userState = {
  loggedIn: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
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

