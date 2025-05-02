import express, {Request, Response, NextFunction} from 'express'
import { authenticateAndExtractUser, parsePartialMontiorPatchData, parseNewMonitor } from '../utils/middlewear.js'
import { PartialMonitorUpdate, NewMonitor, PartialEncryptedMonitorUpdate } from '../types/types.js'
import Monitor from '../models/Monitor.js'
import logger from '../../utils/logger.js'
import mongoose, { isValidObjectId } from 'mongoose'
import { encryptDiscordWebhook } from '../../utils/helper.js'
import { encryptAndPopulateMonitorUpdateData } from '../utils/helpers.js'

const monitorRouter = express.Router()

// Route for creating a new monitor
monitorRouter.post('', authenticateAndExtractUser, parseNewMonitor, async (req: Request<unknown, unknown, NewMonitor>, res: Response, next: NextFunction) => {
  // For fetching the monitors already on this account
  const usersMonitors = await Monitor.find({user: req.user?._id.toString()})

  // Ensures that the max monitors for that account has not been reached
  if (usersMonitors.length >= 20){
    res.send(400).json({error:'Max monitors reached for this tier'})
    return
  }

  const { url, interval} = req.body

  // Ensures that the montior does not exist already in the monitors
  if (usersMonitors.some(monitor => {
    return url === monitor.url
  })) {
    res.status(400).json({error: 'A monitor for this url already exists'})
    return
  }
  
  try {
    // For attempting to create and save the new monitor
    const newMonitor = new Monitor({url, interval, user: req.user?._id.toString()})

    // Checks if there is a discord webhoook provided and adds it to the new monitor
    const {discordWebhook} = req.body
    if (discordWebhook){

      // Encrypts the new webhook and adds to the monitor document
      const {unEncryptedWebhook, notify} = discordWebhook
      newMonitor.discordWebhook = {
        encryptedUrl: encryptDiscordWebhook(unEncryptedWebhook),
        notify
      }
    }

    // Saves the new monitor
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
monitorRouter.patch('/:id', authenticateAndExtractUser, parsePartialMontiorPatchData, async (req: Request<{id: string}, unknown, PartialMonitorUpdate>, res: Response, next: NextFunction) => {
  // Ensures that the id in the request parameters is a valid object id
  const {id} = req.params
  if (!mongoose.isValidObjectId(req.params.id)){
    res.status(400).json({error: 'Invalid Object ID'})
    return
  }

  // For finding the monitor to update
  const monitorToUpdate = await Monitor.findById(id)

  // Asserts that the monitor exists
  if (!monitorToUpdate){
    res.status(404).json({error: 'could not find monitor'})
    return
  }

  // Asserts that the user is authorised to perform update on the monitor
  if (monitorToUpdate.user.toString() !== req.user?._id.toString()){
    res.status(401).json({error: 'Not authorised to access that data'})
    return
  }

  // Encrypts any sesnsitive data and populates an update data object
  const updateData = encryptAndPopulateMonitorUpdateData(req.body)

  // Attempts to make the updates and then return the updated monitor
  try {
    const result = await Monitor.findByIdAndUpdate(id, updateData, {new: true})
    res.status(200).json(result)
  } catch (error){
    logger.error('Error updating a monitor: ', error)
    next(error)
  }

})

// LATER:
// Retrieving all the pings from that monitor

// Must remove all data points associated with a monitor when its deleted

export default monitorRouter