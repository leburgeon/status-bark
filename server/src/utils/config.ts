import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
if (typeof PORT !== 'string'){
  throw new Error('PORT not defined')
}

const MONGODB_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URL
  : process.env.MONGODB_URL
if (typeof MONGODB_URL !== 'string'){
  throw new Error('PORT not defined')
}

export default {PORT,MONGODB_URL}