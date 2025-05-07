import { passwordStrength } from "check-password-strength";
import jwt from 'jsonwebtoken'
import config from "../../utils/config.js";
import { MonitorPatchData, ProcessedMonitorUpdateData } from "../types/types.js";
import { encryptDiscordWebhook } from "../../utils/helper.js";

// Method for checking the strength of a password
export const passwordIsStrong = (password: string): boolean => {
  return passwordStrength(password).id >= 1
}

// Method for generating a jsonwebtoken
export const generateJsonWebToken = (email: string, id: string, timeoutInSeconds: number) => {
  return jwt.sign({email, id}, config.JWT_SECRET, {expiresIn: timeoutInSeconds})
}

// Processes monitor update data
export const processMonitorUpdateData = (data: MonitorPatchData): ProcessedMonitorUpdateData => {
  // For destructuring the update data
  const { url, interval, discordWebhook } = data

  // Initializes the object to return
  const processedData: ProcessedMonitorUpdateData = {}

  // If the url is being updated, add the url to the update data
  if (url) {
    processedData.url = url
  }

  // If the interval is defined, add the interval to the update data
  if (interval) {
    processedData.interval = interval
  }

  // If discordWebhook is defined and unEncryptedWebhook is present, encrypt and add to the update data
  if (discordWebhook?.unEncryptedWebhook) {
    processedData.discordWebhook = {
      encryptedUrl: encryptDiscordWebhook(discordWebhook.unEncryptedWebhook),
    }
  }

  // If discordWebhook is defined and notify is present, handle it (if needed)
  if (discordWebhook?.notify !== undefined) {
    processedData.discordWebhook = {...processedData.discordWebhook, notify: discordWebhook.notify}
  }

  return processedData
}
