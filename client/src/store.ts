import { configureStore } from "@reduxjs/toolkit"
import uiReducer from './reducers/uiSlice'
import userReducer from './reducers/userSlice'
import monitorReducer from './reducers/monitorsSlice'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    monitors: monitorReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store