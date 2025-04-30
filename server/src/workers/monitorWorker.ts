import { Worker } from "bullmq"
import {Redis} from "ioredis"
import config from "../utils/config.js"
import { monitorQueueName } from "../queue/monitorQueue.js"
import { checkUrlStatus, updateMonitorStatusAndReturnOldIfChanged } from "./utils/helpers.js"
import logger from "../utils/logger.js"
import { addDiscordStatusChangeNotificationJob } from "../queue/notifyQueue.js"

const connection = new Redis(config.UPSTASH_ENDPOINT, {maxRetriesPerRequest: null})

export default new Worker(monitorQueueName, async (job) => {
  try {
    // Checks the status of the url
    const urlCheckResult = await checkUrlStatus(job.data.url)
    // Updates the monitor and checks if it has changed from last check
    const hasChanged = await updateMonitorStatusAndReturnOldIfChanged(job.data.monitorId, urlCheckResult)
    
    // If the status changes, adds the discord notification job to the queue
    if (hasChanged){
      await addDiscordStatusChangeNotificationJob({
        webHookUrl: config.TEMP_DISCORD_WEBHOOK,
        url: job.data.url,
        oldStatus: hasChanged,
        newStatus: urlCheckResult
      })
    }
  } catch (error) {
    logger.error('error checking status of url', error)
  }

}, {autorun: false, connection})