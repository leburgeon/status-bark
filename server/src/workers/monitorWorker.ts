import { Worker } from "bullmq"
import {Redis} from "ioredis"
import config from "../utils/config.js"
import { monitorQueueName } from "../queue/monitorQueue.js"
import { checkUrlStatus, updateMonitorStatusAndReturnChanged } from "./utils/helpers.js"
import logger from "../utils/logger.js"

const connection = new Redis(config.UPSTASH_ENDPOINT, {maxRetriesPerRequest: null})

export default new Worker(monitorQueueName, async (job) => {
  try {
    // Checks the status of the url
    const urlCheckResult = await checkUrlStatus(job.data.url)
    // Updates the monitor and checks if it has changed from last check
    const hasChanged = await updateMonitorStatusAndReturnChanged(job.data.monitorId, urlCheckResult)
    
    if (hasChanged){
      console.log(`Status for url ${job.data.url} is now ${urlCheckResult.status} !!!`)
    }
  } catch (error) {
    logger.error('error checking status of url', error)
  }

}, {autorun: false, connection})