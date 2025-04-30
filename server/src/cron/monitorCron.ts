import { CronJob } from "cron";
import Monitor from "../api/models/Monitor.js";
import { addHealthCheckToQueue } from "../queue/monitorQueue.js";

// Job function
const onTick = async () => {
  const now = new Date()
  const monitorsDue = await Monitor.find({
    $expr: {
      $lte: ["$lastChecked", {$subtract: [{$literal: now}, {$multiply: ["$interval", 60 * 1000]}]}]
    }
  })
  monitorsDue.forEach(async monitor => {
    await addHealthCheckToQueue(monitor.url, monitor._id.toString())
  })
}

// Every minute, checks for monitors that are due and adds to the queue
export const scheduleHealthChecksJob = new CronJob(
  '*/10 * * * * *',
  onTick,
  null,
  true
)