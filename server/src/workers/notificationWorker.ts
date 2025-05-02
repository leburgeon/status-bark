import { Worker } from "bullmq"
import { Redis } from 'ioredis'
import config from "../utils/config.js"
import { DiscordStatusChangeNotificationJobData, notificationQueueName, notifyDiscordOfStatusChangeJobName } from "../queue/notifyQueue.js"
import { notifyDiscordOfStatusChange } from "./utils/discordNotifyer.js"
import { decryptDiscordWebhook } from "../utils/helper.js"

const connection = new Redis(config.UPSTASH_ENDPOINT, {maxRetriesPerRequest: null})

// Worker for handling notification jobs
const notificationWorker = new Worker(notificationQueueName, async (job) => {

  console.log('notification worker picked up a job')
  // For handling discord notifications
  if (job.name === notifyDiscordOfStatusChangeJobName){
    const { monitorUrl, encryptedWebookUrl, oldStatus, newStatus } = job.data as DiscordStatusChangeNotificationJobData
    const decryptedWebhookUrl = decryptDiscordWebhook(encryptedWebookUrl)
    await notifyDiscordOfStatusChange(decryptedWebhookUrl, monitorUrl, oldStatus, newStatus)
  }
}, {autorun: false, connection})

notificationWorker.run()
console.log('started notification worker')