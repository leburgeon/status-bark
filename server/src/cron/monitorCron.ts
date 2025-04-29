import { CronJob } from "cron";
import Monitor from "../api/models/Monitor.js";

// Job function
const onTick = async () => {
  const now = new Date()
  const monitorsDue = await Monitor.find({
    $expr: {
      $lte: ["$lastChecked", {$subtract: [{$literal: now}, {$multiply: ["$interval", 60 * 1000]}]}]
    }
  })
  console.log(`${monitorsDue.length} found to check!`)
}

// Every minute, checks for monitors that are due and adds to the queue
export const scheduleHealthChecksJob = new CronJob(
  '*/20 * * * * *',
  onTick,
  null,
  true
)