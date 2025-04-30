import axios from "axios"
import Monitor from "../../api/models/Monitor.js"

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

export const updateMonitorStatusAndReturnOldIfChanged = async (id: string, result: {status: 'UP' | 'DOWN', timeChecked: Date}): Promise<{status: 'UP' | 'DOWN' | 'NOTCHECKED', timeChecked: Date} | false> => {
  // Updates the status and the lastChecked field of the monitor
  const updateResult = await Monitor.findByIdAndUpdate(id, {lastChecked: result.timeChecked, lastStatus: result.status})

  // Throws error if no update was made
  if (!updateResult){
    throw new Error('Monitor not found or updated')
  }

  // Checks if the status changed from the last check, returns true if it has
  if (updateResult.lastStatus !== result.status){
    return {status: updateResult.lastStatus, timeChecked: updateResult.lastChecked}
  } else {
    return false
  }
}

