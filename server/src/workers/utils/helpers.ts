import axios from "axios"
import Monitor from "../../api/models/Monitor.js"
import { MonitorDocument } from "../../api/models/Monitor.js"

export const checkUrlStatus = async (url: string): Promise<{status: 'UP' | 'DOWN', timeChecked: Date}> => {
  const timeChecked = new Date()
  let status: 'UP' | 'DOWN'
  const response = await axios.get(url, {timeout: 3000})
  if (response.status >= 200 && response.status < 400){
    status = 'UP'
  } else {
    status = 'DOWN'
  }
  return {
    status,timeChecked
  }
}

// Method for updating the monitor document with the new status and returning the old monitor
export const updateMonitorStatusAndReturnOldMonitor = async (id: string, result: {status: 'UP' | 'DOWN', timeChecked: Date}): Promise<MonitorDocument> => {
  // Updates the status and the lastChecked field of the monitor
  const oldMonitor = await Monitor.findByIdAndUpdate(id, {lastChecked: result.timeChecked, lastStatus: result.status})

  // Throws error if no update was made
  if (!oldMonitor){
    throw new Error('Monitor not found or updated')
  }

  // Returns the old monitor
  return oldMonitor
}

