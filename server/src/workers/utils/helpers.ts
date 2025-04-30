import axios from "axios"

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

