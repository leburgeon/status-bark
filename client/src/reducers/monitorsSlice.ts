import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

export const MonitorSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  url: z.string(),
  interval: z.number(),
  lastStatus: z.enum(['UP', 'DOWN', 'NOTCHECKED']),
  lastChecked: z.string().date(),
  createdAt: z.string(),
  discordWebhook: z.object({
    notify: z.boolean(),
    urlPresent: z.boolean()
  })
})

export type Monitor = z.infer<typeof MonitorSchema>

const initialState: {monitorsArray: Monitor[]} = {monitorsArray: [
  {id: 'fooid',
    interval: 5,
    nickname: 'foonick',
    url: 'ooalkdsjfhaksljdfhklsadhflkdso.com',
    lastStatus: 'UP',
    createdAt: "2025-05-16T10:54:42.965Z",
    lastChecked: "2025-05-16T10:54:42.965Z",
    discordWebhook: {notify: true, urlPresent: true}
  },{id: 'fooid',
    interval: 5,
    nickname: 'foonick',
    url: 'ooasdfasdfffffffffo.com',
    lastStatus: 'NOTCHECKED',
    createdAt: "2025-05-16T10:54:42.965Z",
    lastChecked: "2025-05-16T10:54:42.965Z",
    discordWebhook: {notify: false, urlPresent: false}
  }
]}

const monitorSlice = createSlice({
  name: 'monitors',
  initialState,
  reducers: {
    setMonitors: (state, action: PayloadAction<Monitor[]>) => {
      state.monitorsArray = action.payload
    },
    clearMonitors: (state) => {
      state.monitorsArray = []
    },
    updateMonitor: (state, action: PayloadAction<Monitor>) => {
      state.monitorsArray = state.monitorsArray.map(monitor => {
        if (monitor.id !== action.payload.id){
          return monitor
        } else {
          return action.payload
        }
      })
    },
    deleteMonitor: (state, action: PayloadAction<string>) => {
      state.monitorsArray = state.monitorsArray.filter(monitor => monitor.id !== action.payload)
    },

  }
})

export const {setMonitors, clearMonitors} = monitorSlice.actions

export default monitorSlice.reducer