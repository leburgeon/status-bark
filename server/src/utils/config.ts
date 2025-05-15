import dotenv from 'dotenv'
dotenv.config()

// For ensuring an environment variable is defined, and throwing an error if not
const getEnvVariable = (key: string): string => {
  const value = process.env[key]
  if (typeof value !== 'string' && process.env.NODE_ENV !== 'test'){
    throw new Error(`${key} is not defined`)
  }
  if (value === undefined){
    console.error(`${key} is undefined 'ere`)
    return 'undefined'
  }
  return value
}

const PORT = getEnvVariable('PORT')

const MONGODB_URL = process.env.NODE_ENV === 'test'
  ? getEnvVariable('TEST_MONGODB_URL')
  : getEnvVariable('MONGODB_URL')

const JWT_SECRET = getEnvVariable('JWT_SECRET')

const UPSTASH_ENDPOINT = getEnvVariable('UPSTASH_ENDPOINT')

const TEST_DISCORD_WEBHOOK = getEnvVariable('TEST_DISCORD_WEBHOOK')

const WEBHOOK_ENCRYPTION_KEY = getEnvVariable('WEBHOOK_ENCRYPTION_KEY')

export default {
  PORT,
  MONGODB_URL,
  JWT_SECRET,
  UPSTASH_ENDPOINT,
  TEST_DISCORD_WEBHOOK,
  WEBHOOK_ENCRYPTION_KEY
}