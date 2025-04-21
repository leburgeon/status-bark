import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.static('../client/dist'))

app.use('/api/ping', (_req, res) => {
  res.send('pong')
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})