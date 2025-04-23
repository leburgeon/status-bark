import logger from './utils/logger.js'
import config from './utils/config.js'
import app from './app.js'

logger.info(`starting server in ${process.env.NODE_ENV} environemnt`)

app.listen(config.PORT, () => {
  logger.info('Server listening on port 3000')
})