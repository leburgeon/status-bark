import winston from "winston"


// For storing the transports to use with the winston logger
const transports: winston.transport[] = []

// Adds the console transport if in development mode
if (process.env.NODE_ENV === 'development'){
  transports.push(new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple())
  }))
}

// Adds console transport for production mode, fly captures the logs
if (process.env.NODE_ENV === 'production'){
  transports.push(new winston.transports.Console({format: winston.format.json()}))
}

// Adds silent console transport for testing
if (process.env.NODE_ENV === 'test'){
  transports.push(new winston.transports.Console({silent: true}))
}

// Creates a logger with the custom transports
const logger = winston.createLogger({
  level: 'info',
  transports
})


export default logger