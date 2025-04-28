import express, {Request, Response, NextFunction} from 'express'
import { authenticateAndExtractUser, parseMonitorIntervalUpdate, parseNewMonitor } from '../utils/middlewear.js'
import { MonitorIntervalUpdate, NewMonitor } from '../types/types.js'
import Monitor from '../models/Monitor.js'
import logger from '../../utils/logger.js'
import { isValidObjectId } from 'mongoose'

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

  // Returns error response if inavalid object id
  if (!isValidObjectId(req.params.id)){
    res.status(400).json({error:'Invalid object id'})
    return
  }

  const monitorToDelete = await Monitor.findById(req.params.id)

  // Returns the correct error response if the monitor not found
  if (!monitorToDelete){
    res.status(404).json({error: 'Couldnt find that monitor to delete'})
    return
  }

  // If the user ids do not match, send unauthorised response
  if (monitorToDelete.user.toString() !== req.user?._id.toString()){
    res.status(401).json({error: 'Unauthorised'})
    return
  }

  // Attempts to delete the 
  try {
    await Monitor.findByIdAndDelete(monitorToDelete._id.toString())
    res.status(410).json({data: 'Successfuly deleted'})
  } catch (error) {
    logger.error('Error deleting a monitor', error)
    res.status(500).json({error: 'Internal server error'})
  }

})

// Route for modifying the interval
monitorRouter.patch('', authenticateAndExtractUser, parseMonitorIntervalUpdate, async (req: Request<unknown, unknown, MonitorIntervalUpdate>, res: Response, next: NextFunction) => {

  const {id, interval} = req.body
  const intervalInteger = parseInt(interval)

  // For updating the monitor with the new interval
  const monitorToUpdate = await Monitor.findById(id)

  // Asserts that the monitor exists
  if (!monitorToUpdate){
    res.status(404).json({error: 'could not find monitor'})
    return
  }


  // Checks that the user is authorised to perform update
  if (monitorToUpdate.user.toString() !== req.user?._id.toString()){
    res.status(401).json({error: 'Not authorised to access that data'})
    return
  }

  // Attempts to update the monitor and returns the response
  try {
    monitorToUpdate.interval = intervalInteger
    await monitorToUpdate.save()
    res.status(200).json({data: {newInterval: intervalInteger}})
  } catch (error){
    next(error)
  }
})

// LATER:
// Retrieving all the pings from that monitor

// Must remove all data points associated with a monitor when its deleted

export default monitorRouter