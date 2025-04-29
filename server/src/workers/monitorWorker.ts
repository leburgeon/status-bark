import { Worker } from "bullmq"
import {Redis} from "ioredis"
import config from "../utils/config.js"
import { monitorQueueName } from "../queue/monitorQueue.js"
import Monitor from "../api/models/Monitor.js"

const connection = new Redis(config.UPSTASH_ENDPOINT, {maxRetriesPerRequest: null})

export default new Worker(monitorQueueName, async (job) => {
  console.log('recieved a job from the queue')
  const now = new Date()
  const result = await Monitor.findByIdAndUpdate(job.data.monitorId, {lastChecked: now, lastStatus: 'UP'})
  if (result){
    console.log('one found and updated')
  } else {
    console.log('could not find')
  }
}, {autorun: false, connection})