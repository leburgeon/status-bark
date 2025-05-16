import axios from 'axios'
import logger from '../../utils/logger.js'
export interface urlStatus {status: string, timeChecked: Date}

export const notifyDiscordOfStatusChange = async (webHookUrl: string, url: string, oldStatus: urlStatus, newStatus: urlStatus) => {
  console.log(typeof oldStatus.timeChecked)
  try{
    const embed = {
      username: 'Status-Bark-Bot',
      embeds: [
        {
          title: '🔄 URL Status Change Detected',
          color: newStatus.status === 'UP' ? 0x57f287 : 0xed4245, // green or red
          fields: [
            {
              name: '🌐 URL',
              value: url,
            },
            {
              name: '📈 Previous Status',
              value: `${oldStatus.status} (@ ${new Date(oldStatus.timeChecked).toISOString()})`,
              inline: true,
            },
            {
              name: '📉 New Status',
              value: `${newStatus.status} (@ ${new Date(newStatus.timeChecked).toISOString()})`,
              inline: true,
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Status-Bark Monitoring System',
          }
        }
      ]
    }
    await axios.post(webHookUrl, embed)
  } catch (error){
    logger.error('Error sending notification', error)
  }
}