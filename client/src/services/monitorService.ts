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

export default {addMonitor, getMonitors}