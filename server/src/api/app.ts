import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRouter.js'
import { errorHandler, requestLogger } from './utils/middlewear.js'
import monitorRouter from './routes/monitorRouter.js'

const app = express()

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

app.use('/api/monitors', monitorRouter)

// For handling errors passed to next funciton
app.use(errorHandler)

// For handling unkown endpoints, redirects to the index
app.use((_req, res) => {
  res.redirect('/')
})

export default app