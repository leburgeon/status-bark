import express from 'express'
import cors from 'cors'
import logger from './utils/logger.js'

const app = express()

app.use(cors())

app.use(express.static('../client/dist'))

app.use('/api/ping', (_req, res) => {
  res.send('pong')
})

app.listen(3000, () => {
  logger.info('Server listening on port 3000')
})