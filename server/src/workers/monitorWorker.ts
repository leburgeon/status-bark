import { Worker } from "bullmq"
import {Redis} from "ioredis"
import config from "../utils/config.js"
import { monitorQueueName } from "../queue/monitorQueue.js"
import Monitor from "../api/models/Monitor.js"
import { checkUrlStatus } from "./utils/helpers.js"
import logger from "../utils/logger.js"

const connection = new Redis(config.UPSTASH_ENDPOINT, {maxRetriesPerRequest: null})

export default new Worker(monitorQueueName, async (job) => {
  console.log('recieved a job from the queue')
  try {
    const result = await checkUrlStatus(job.data.url)
    console.log('status checked:' + job.data.url, result)
    const updateResult = await Monitor.findByIdAndUpdate(job.data.monitorId, {lastChecked: result.timeChecked, lastStatus: result.status})
    if (updateResult?.lastStatus !== result.status){
      console.log('status changed!! Alert!!')
    } else {
      console.log('status was same tho')
    }
  } catch (error) {
    logger.error('error checking status of url', error)
  }

}, {autorun: false, connection})