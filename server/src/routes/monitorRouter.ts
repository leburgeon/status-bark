import express, {Request, Response, NextFunction} from 'express'
import { authenticateAndExtractUser, parseMonitorIntervalUpdate, parseNewMonitor } from '../utils/middlewear.js'
import { MonitorIntervalUpdate, NewMonitor } from '../types/types.js'
import Monitor from '../models/Monitor.js'
import { DeleteResult } from 'mongoose'

const monitorRouter = express.Router()

// Route for creating a new monitor
monitorRouter.post('', authenticateAndExtractUser, parseNewMonitor, async (req: Request<unknown, unknown, NewMonitor>, res: Response, next: NextFunction) => {
  const usersMonitors = await Monitor.find({user: req.user?._id.toString()})

  // Ensures that the max monitors for that account has not been reached
  if (usersMonitors.length >= 20){
    res.send(400).json({error:'Max monitors reached for this tier'})
    return
  }

  const { url, interval } = req.body

  // Ensures that the montior does not exist already in the monitors
  if (usersMonitors.some(monitor => {
    return url === monitor.url
  })) {
    res.status(400).json({error: 'A monitor for this url already exists'})
    return
  }

  // Saves the new monitor
  try {
    const newMonitor = new Monitor({url, interval, user: req.user?._id.toString()})
    await newMonitor.save()
    res.status(201).json({data: 'Monitor added successfuly'})
  } catch (error) {
    next(error)
  }
})

// Route for deleting a monitor
monitorRouter.delete('/:id', authenticateAndExtractUser, async (req: Request, res: Response, _next: NextFunction) => {
  const result: DeleteResult = await Monitor.deleteOne({_id: req.params.id, user: req.user?._id.toString()})

  // Returns error if not successful
  if (result.deletedCount !== 1){
    res.status(400).json({error: 'Error deleting that monitor'})
  } else {
    res.status(410).json({data: 'Successfuly deleted'})
  }
})

// Route for modifying the interval
monitorRouter.patch('/', authenticateAndExtractUser, parseMonitorIntervalUpdate, async (req: Request<unknown, unknown, MonitorIntervalUpdate>, res: Response, _next: NextFunction) => {
  const {id, interval} = req.body
  const intervalInteger = parseInt(interval)

  // For updating the monitor with the new interval
  const result = await Monitor.updateOne({_id: id, user: req.user?._id}, {$set: {interval: intervalInteger}})

  // Checks that the monitor was modified
  if (result.modifiedCount !== 1){
    res.status(400).json({error: 'not updated'})
  } else {
    res.status(200).json({data: 'Monitor updated'})
  }
})

// LATER:
// Retrieving all the pings from that monitor

// Must remove all data points associated with a monitor when its deleted

export default monitorRouter