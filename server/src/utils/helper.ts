import crypto from 'crypto'
import config from './config.js'

export const encryptDiscordWebhook = (webhook: string) => {
  console.log('boop beep encrypting ' + webhook)
  return crypto.randomBytes(32).toString('hex')
}

export const decryptDiscordWebhook = (encryptedWebhook: string) => {
  console.log('beep boop decrypting '+ encryptedWebhook)
  return config.TEMP_DISCORD_WEBHOOK
}