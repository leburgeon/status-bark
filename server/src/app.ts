import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRouter.js'
import { errorHandler, requestLogger } from './utils/middlewear.js'
import logger from './utils/logger.js'
import mongoose from 'mongoose'
import config from './utils/config.js'

const app = express()

try {
  logger.info('connecting to MongoDB...')
  await mongoose.connect(config.MONGODB_URL)

  logger.info('connected to database')
} catch (error) {
  console.error('###########################',error)
  logger.error('Error connecting to MongoDB', error)
}

app.use(cors())

app.use(express.json())

app.use(express.static('../client/dist'))

app.use(requestLogger)

app.use('/api/ping', (_req, res) => {
  res.send('pong')
})

app.use('/health', (_req, res) => {
  res.send('OK')
})

app.use('/api/users', userRouter)

// For handling errors passed to next funciton
app.use(errorHandler)

// For handling unkown endpoints, redirects to the index
app.use((_req, res) => {
  res.redirect('/')
})

export default app