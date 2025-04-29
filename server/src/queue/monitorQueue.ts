
import {Queue} from 'bullmq'
import config from "../utils/config.js"

import { Redis } from "ioredis"
const connection = new Redis(config.UPSTASH_ENDPOINT)

export const monitorQueueName = 'MonitorQueue'

const healthCheckQueue = new Queue(monitorQueueName, {connection})

export const addHealthCheckToQueue = async (url: string, monitorId: string) => {
  await healthCheckQueue.add('checkUrl', {
    url,
    monitorId
  })
}