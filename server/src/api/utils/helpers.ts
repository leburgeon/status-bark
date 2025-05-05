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
  // Spreads the update data into the processed data object
  let processedData: ProcessedMonitorUpdateData = {...data}

  // If discord webhook updates are present, checks if a new url has been provided and encrypts it before adding to the data
  const { discordWebhook } = data
  if (discordWebhook && discordWebhook.unEncryptedWebhook){
    processedData = {
      ...processedData, 
      discordWebhook: {
        ...processedData.discordWebhook, 
        encryptedUrl: encryptDiscordWebhook(discordWebhook.unEncryptedWebhook)
      }
    }
  }

  // Returns the processes data
  return processedData
}