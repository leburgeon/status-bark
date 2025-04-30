
import {Queue} from 'bullmq'
import config from "../utils/config.js"
import { urlStatus } from '../workers/utils/discordNotifyer.js'

import { Redis } from "ioredis"
const connection = new Redis(config.UPSTASH_ENDPOINT)

// Initialises the notifications queue
export const notificationQueueName = 'NotificationQueue'
const notificationQueue = new Queue(notificationQueueName, {connection})

// Helper method for adding the discord notification to the queue
export interface DiscordStatusChangeNotificationJobData {webHookUrl: string, url: string, oldStatus: urlStatus, newStatus:urlStatus}
export const addDiscordStatusChangeNotificationJob = async (notificaitonData: DiscordStatusChangeNotificationJobData) => {
 console.log('discord notification job added to queue')
 const {webHookUrl, url, oldStatus, newStatus} = notificaitonData
 await notificationQueue.add('notifyDiscordStatusChange', {
    webHookUrl, 
    url, 
    oldStatus, 
    newStatus
  })
} 