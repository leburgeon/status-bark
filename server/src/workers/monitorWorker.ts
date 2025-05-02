import { Worker } from "bullmq"
import {Redis} from "ioredis"
import config from "../utils/config.js"
import { monitorQueueName } from "../queue/monitorQueue.js"
import { checkUrlStatus, updateMonitorStatusAndReturnOldMonitor} from "./utils/helpers.js"
import logger from "../utils/logger.js"
import mongoose from "mongoose"
import { addDiscordStatusChangeNotificationJob } from "../queue/notifyQueue.js"
import { urlStatus } from "./utils/discordNotifyer.js"

console.log('connecting monitor worker to mongoDB...')
await mongoose.connect(config.MONGODB_URL)
console.log('connected monitor worker to mongoDB')

const connection = new Redis(config.UPSTASH_ENDPOINT, {maxRetriesPerRequest: null})

// Worker for completing scheduled health checks on due monitors
const monitorWorker = new Worker(monitorQueueName, async (job) => {
  try {
    // Checks the status of the url
    const urlCheckResult = await checkUrlStatus(job.data.url)
    // Updates the monitor and checks if it has changed from last check, recieving notification address data if it exists
    const oldMonitor = await updateMonitorStatusAndReturnOldMonitor(job.data.monitorId, urlCheckResult)

    // If the status has changed and there is a discord notify address, add a notify job to the queueu
    if (oldMonitor.lastStatus !== urlCheckResult.status && oldMonitor.discordWebhook.notify){
      const oldStatus: urlStatus = {status: oldMonitor.lastStatus, timeChecked: oldMonitor.lastChecked}

      // Since notify is true, encrypted Url must be defined on document through schema validation
      const encryptedUrl = oldMonitor.discordWebhook.encryptedUrl as string

      // Adds the notify job to the queue
      await addDiscordStatusChangeNotificationJob(encryptedUrl, job.data.url, oldStatus, urlCheckResult)
    }
    
  } catch (error) {
    logger.error('error checking status of url', error)
    throw error
  }

}, {autorun: false, connection})


monitorWorker.run()
console.log('started monitor worker')