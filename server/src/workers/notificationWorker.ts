import { Worker } from "bullmq"
import { Redis } from 'ioredis'
import config from "../utils/config.js"
import { DiscordStatusChangeNotificationJobData, notificationQueueName, notifyDiscordOfStatusChangeJobName } from "../queue/notifyQueue.js"
import { notifyDiscordOfStatusChange } from "./utils/discordNotifyer.js"

const connection = new Redis(config.UPSTASH_ENDPOINT, {maxRetriesPerRequest: null})

const notificationWorker = new Worker(notificationQueueName, async (job) => {
  console.log('notification worker picked up a job')
  if (job.name === notifyDiscordOfStatusChangeJobName){
    const { url, webHookUrl, oldStatus, newStatus } = job.data as DiscordStatusChangeNotificationJobData
    await notifyDiscordOfStatusChange(url, oldStatus, newStatus, webHookUrl)
  }
}, {autorun: false, connection})

notificationWorker.run()
console.log('started notification worker')