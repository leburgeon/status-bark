import { Worker } from "bullmq"
import {Redis} from "ioredis"
import config from "../utils/config.js"
import { monitorQueueName } from "../queue/monitorQueue.js"
import { checkUrlStatus, updateMonitorStatusAndReturnOldIfChanged } from "./utils/helpers.js"
import logger from "../utils/logger.js"
import { addDiscordStatusChangeNotificationJob } from "../queue/notifyQueue.js"
import mongoose from "mongoose"

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
    const hasChanged = await updateMonitorStatusAndReturnOldIfChanged(job.data.monitorId, urlCheckResult)
    
    // If the status has changed and there are addresses to send to, adds the correct notification job to the queueu
    if (hasChanged && hasChanged.addresses.length > 0){
      // Data about the change that occured
      const changeData = {
        url: job.data.url,
        oldStatus: hasChanged,
        newStatus: urlCheckResult
      }

      // For each of the notification methods, add the corresponding notification job to the queue
      hasChanged.addresses.forEach(async address => {
        // For adding the discord notification jobs
        if (address.notificationType === 'Discord-Web-Hook'){
          await addDiscordStatusChangeNotificationJob({
            webHookUrl: address.address,
            ...changeData
          })
        } else if (address.notificationType === 'Email'){
          console.log('TODO: Add Email Notification Job')
        }
      })
      
    }
  } catch (error) {
    logger.error('error checking status of url', error)
    throw error
  }

}, {autorun: false, connection})


monitorWorker.run()
console.log('started monitor worker')