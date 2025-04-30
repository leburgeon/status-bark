import dotenv from 'dotenv'
dotenv.config()

// For ensuring an environment variable is defined, and throwing an error if not
const getEnvVariable = (key: string): string => {
  const value = process.env[key]
  if (typeof value !== 'string'){
    throw new Error(`${key} is not defined`)
  }
  return value
}

const PORT = getEnvVariable('PORT')

const MONGODB_URL = process.env.NODE_ENV === 'test'
  ? getEnvVariable('TEST_MONGODB_URL')
  : getEnvVariable('MONGODB_URL')

const JWT_SECRET = getEnvVariable('JWT_SECRET')

const UPSTASH_ENDPOINT = getEnvVariable('UPSTASH_ENDPOINT')

const TEMP_DISCORD_WEBHOOK = getEnvVariable('TEMP_DISCORD_WEBHOOK')

export default {
  PORT,
  MONGODB_URL,
  JWT_SECRET,
  UPSTASH_ENDPOINT,
  TEMP_DISCORD_WEBHOOK
}