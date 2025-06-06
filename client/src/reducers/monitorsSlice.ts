import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { z } from "zod"
import monitorService from "../services/monitorService"
import { setFetching, showError } from "./uiSlice"

export const MonitorSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  url: z.string(),
  interval: z.number(),
  lastStatus: z.enum(['UP', 'DOWN', 'NOTCHECKED']),
  lastChecked: z.string(),
  createdAt: z.string(),
  discordWebhook: z.object({
    notify: z.boolean(),
    urlPresent: z.boolean()
  })
})

export type Monitor = z.infer<typeof MonitorSchema>

export const NewMonitorSchema = z.object({
  nickname: z.string(),
  url: z.string(),
  interval: z.number(),
  discordWebhook: z.string().optional()
})

export type NewMonitorData = z.infer<typeof NewMonitorSchema>

const initialState: {monitorsArray: Monitor[]} = {monitorsArray: []}

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
    addMonitor: (state, action: PayloadAction<Monitor>) => {
      state.monitorsArray.push(action.payload)
    },
    removeMonitor: (state, action: PayloadAction<string>) => {
      state.monitorsArray = state.monitorsArray.filter(monitor => monitor.id !== action.payload)
    },

  }
})

export const {setMonitors, clearMonitors, addMonitor, removeMonitor, updateMonitor} = monitorSlice.actions

export const createMonitor = (data: NewMonitorData) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await monitorService.addMonitor(data)
      const newMonitor = MonitorSchema.parse(response.data)
      dispatch(addMonitor(newMonitor))
    } catch (error: unknown) {
      let errorMessage = 'Error creating monitor'
      if (error instanceof Error){
        errorMessage += error.message
      }
      dispatch(showError(errorMessage))
    }
  }
}

export const initialiseMonitors = () => {
  return async (dispatch:Dispatch) => {
    try {
      const response = await monitorService.getMonitors()
      const monitorsArray = MonitorSchema.array().parse(response.data)
      dispatch(setMonitors(monitorsArray))
    } catch (error) {
      let errorMessage = 'Error fetching monitors'
      if (error instanceof Error){
        errorMessage += error.message
      }
      dispatch(showError(errorMessage))
    }
  }
}

export const deleteMonitor = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      await monitorService.deleteMonitor(id)
      dispatch(removeMonitor(id))
    } catch (error) {
      let errorMessage = 'Error deleting monitor'
      if (error instanceof Error){
        errorMessage += error.message
      }
      dispatch(showError(errorMessage))
    }
  }
}

export const sendWebhookPatchAndUpdateMonitor = (id: string, data: {notify: boolean, unEncryptedWebhook?: string | null}) => {
  return async (dispatch: Dispatch) => {
    dispatch(setFetching(true))
    try {
      const response = await monitorService.patchWebhook(id, data)
      const updatedMonitor = MonitorSchema.parse(response.data)
      dispatch(updateMonitor(updatedMonitor))
    } catch (error) {
      let errorMessage = 'Error updating notification settings'
      if (error instanceof Error) {
        errorMessage += error.message
      }
      dispatch(showError(errorMessage))
    } finally {
      dispatch(setFetching(false))
    }
  }
}

export const sendMonitorPatchAndUpdateMonitor = (id: string, data: {nickname: string, url: string, interval: number}) => {
  return async (dispatch: Dispatch) => {
    dispatch(setFetching(true))
    try {
      const response = await monitorService.patchMonitor(id, data)
      const updatedMonitor = MonitorSchema.parse(response.data)
      dispatch(updateMonitor(updatedMonitor))
    } catch (error){
      let errorMessage = 'Error updating monitor info'
      if (error instanceof Error){
        errorMessage += error.message
      }
      dispatch(showError(errorMessage))
    } finally {
      dispatch(setFetching(false))
    }
  }
}

export default monitorSlice.reducer