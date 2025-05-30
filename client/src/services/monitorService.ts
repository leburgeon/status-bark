import axios from 'axios'
import { NewMonitorData } from '../reducers/monitorsSlice'

const addMonitor = async (data: NewMonitorData) => {
  const response = await axios.post('/api/monitors', {
    nickname: data.nickname, 
    url: data.url, 
    interval: data.interval.toString(), 
    discordWebhook: {
      notify: false,
      unEncryptedWebhook: data.discordWebhook
    }})
  return response
}

const getMonitors = async () => {
  const response = await axios.get('/api/monitors')
  return response
}

const deleteMonitor = async (id: string) => {
  const response = await axios.delete(`/api/monitors/${id}`)
  return response
}

// Method for sending a webhook patch
const patchWebhook = async (id: string, data: {notify: boolean, unEncryptedWebhook?: string | null}) => {
  const response = await axios.patch(`/api/monitors/discordWebhook/${id}`, data)
  return response
}

// Methof for patching the details of a monitor
const patchMonitor = async (id: string, data: {nickname: string, url: string, interval: number}) => {
  const response = await axios.patch(`/api/monitors/${id}`,{...data, interval: data.interval.toString()})
  return response
}

export default {addMonitor, getMonitors, deleteMonitor, patchWebhook, patchMonitor}