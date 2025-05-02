import { passwordStrength } from "check-password-strength";
import jwt from 'jsonwebtoken'
import config from "../../utils/config.js";
import { PartialEncryptedMonitorUpdate, PartialMonitorUpdate } from "../types/types.js";
import { encryptDiscordWebhook } from "../../utils/helper.js";

// Method for checking the strength of a password
export const passwordIsStrong = (password: string): boolean => {
  return passwordStrength(password).id >= 1
}

// Method for generating a jsonwebtoken
export const generateJsonWebToken = (email: string, id: string, timeoutInSeconds: number) => {
  return jwt.sign({email, id}, config.JWT_SECRET, {expiresIn: timeoutInSeconds})
}

export const encryptAndPopulateMonitorUpdateData = (requestBody: PartialMonitorUpdate): PartialEncryptedMonitorUpdate => {
  
  // Destructures the update data from the request body
  const {url, interval, discordWebhook} = requestBody

  // For storing the update data
  const updateData: PartialEncryptedMonitorUpdate = {}

  // For conditionally adding url update data
  if (url){
    updateData.url = url
  }

  // For conditionally adding the intervaal update data
  if (interval){
    updateData.interval = interval
  }

  // For conditionally adding the encrypted discord webhook data
  if (discordWebhook){
    updateData.discordWebhook = {
      notify: discordWebhook.notify,
      encryptedUrl: encryptDiscordWebhook(discordWebhook.unEncryptedWebhook)
    }
  }

  return updateData
}