import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

export const MonitorSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  url: z.string(),
  lastStatus: z.string(),
  createdAt: z.string(),
  discordWebhook: z.object({
    notify: z.boolean(),
    urlPresent: z.boolean()
  })
})

type Monitor = z.infer<typeof MonitorSchema>

const initialState: {monitors: Monitor[]} = {monitors: [
  {id: 'fooid',
    nickname: 'foonick',
    url: 'ooo.com',
    lastStatus: 'UP',
    createdAt: "2025-05-16T10:54:42.965Z",
    discordWebhook: {notify: false, urlPresent: false}
  }
]}

const monitorSlice = createSlice({
  name: 'monitors',
  initialState,
  reducers: {
    setMonitors: (state, action: PayloadAction<Monitor[]>) => {
      state.monitors = action.payload
    },
    clearMonitors: (state) => {
      state.monitors = []
    },
    updateMonitor: (state, action: PayloadAction<Monitor>) => {
      state.monitors = state.monitors.map(monitor => {
        if (monitor.id !== action.payload.id){
          return monitor
        } else {
          return action.payload
        }
      })
    },
    deleteMonitor: (state, action: PayloadAction<string>) => {
      state.monitors = state.monitors.filter(monitor => monitor.id !== action.payload)
    },

  }
})

export const {setMonitors, clearMonitors} = monitorSlice.actions

export default monitorSlice.reducer