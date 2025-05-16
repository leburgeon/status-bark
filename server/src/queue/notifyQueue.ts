
import {Queue} from 'bullmq'
import config from "../utils/config.js"
import { urlStatus } from '../workers/utils/discordNotifyer.js'


import { Redis } from "ioredis"
const connection = new Redis(config.UPSTASH_ENDPOINT)


// The const name for the notification queue
export const notificationQueueName = 'NotificationQueue'

// Initialises the notifications queue
const notificationQueue = new Queue(notificationQueueName, {connection})




// Type for the data needed to send a discord status change notification
export interface DiscordStatusChangeNotificationJobData {encryptedWebookUrl: string, monitorUrl: string, oldStatus: urlStatus, newStatus:urlStatus}

// The job name for discord status change notification
export const notifyDiscordOfStatusChangeJobName = 'notifyDiscordStatusChange'

// Method for adding a status change notification to the discord notification queue
export const addDiscordStatusChangeNotificationJob = async (encryptedWebookUrl: string, monitorUrl: string, oldStatus: urlStatus, newStatus: urlStatus) => {
 console.log('discord notification job added to queue from the helper')
 const notificaitonData: DiscordStatusChangeNotificationJobData = {encryptedWebookUrl, monitorUrl, oldStatus, newStatus}
 await notificationQueue.add(notifyDiscordOfStatusChangeJobName, notificaitonData)
} 