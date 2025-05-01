import axios from 'axios'

export interface urlStatus {status: string, timeChecked: Date}

export const notifyDiscordOfStatusChange = async (webHookUrl: string, url: string, oldStatus: urlStatus, newStatus: urlStatus) => {
  await axios.post(webHookUrl, {
    username: 'Status-Bark-Bot',
    content: `URL: ${url} was ${oldStatus.status} when last checked at ${oldStatus.timeChecked} but its status has changed to ${newStatus.status}! (checked at: ${newStatus.timeChecked})`
  })
}