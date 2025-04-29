import { scheduleHealthChecksJob } from "./monitorCron.js";
import mongoose from 'mongoose'
import config from "../utils/config.js";

try {
  await mongoose.connect(config.MONGODB_URL)
  console.log('Cron jobs connected to mongoDB')
} catch (error){
  console.error('Error connecting cron jobs to mongoDB', error)
}


scheduleHealthChecksJob.start()
console.log('started cron job for scheduling health checks')