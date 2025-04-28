import logger from '../utils/logger.js'
import config from '../utils/config.js'
import app from './app.js'
import mongoose from 'mongoose'

try {
  logger.info('connecting to MongoDB...')
  await mongoose.connect(config.MONGODB_URL)
  logger.info('connected to database')
} catch (error) {
  console.error('###########################',error)
  logger.error('Error connecting to MongoDB', error)
}


logger.info(`starting server in ${process.env.NODE_ENV} environemnt`)

app.listen(config.PORT, () => {
  logger.info('Server listening on port 3000')
})