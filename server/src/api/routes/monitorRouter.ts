import express, {Request, Response, NextFunction} from 'express'
import { authenticateAndExtractUser, parsePartialMontiorPatchData, parseNewMonitor, parseAndProcessDiscordWebhookPatchData } from '../utils/middlewear.js'
import { MonitorPatchData, NewMonitor, EncryptedDiscordWebhookObject, ProcessedDiscordWebhookPatchData } from '../types/types.js'
import Monitor from '../models/Monitor.js'
import logger from '../../utils/logger.js'
import mongoose, { isValidObjectId } from 'mongoose'
import { encryptSymmetricIntoPayload } from '../../utils/helper.js'
import { buildUpdate } from '../utils/helpers.js'

const monitorRouter = express.Router()

// Route for retrieving the monitors of a user
monitorRouter.get('', authenticateAndExtractUser, async (req: Request, res: Response, _next: NextFunction) => {

  // Finds the monitors associated with the user extracted from the token
  const usersMonitors = await Monitor.find({user: req.user?._id.toString()})

  res.status(200).json(usersMonitors)
  return
})

// Route for creating a new monitor
monitorRouter.post('', authenticateAndExtractUser, parseNewMonitor, async (req: Request<unknown, unknown, NewMonitor>, res: Response, next: NextFunction) => {
  // For fetching the monitors already on this account
  const usersMonitors = await Monitor.find({user: req.user?._id.toString()})

  // Ensures that the max monitors for that account has not been reached
  if (usersMonitors.length >= 20){
    res.send(400).json({error:'Max monitors reached for this tier'})
    return
  }

  const {nickname, url, interval} = req.body
  
  try {
    // For attempting to create and save the new monitor
    const newMonitor = new Monitor({nickname, url, interval, user: req.user?._id.toString()})

    // Checks if there is a discord webhoook provided
    const {discordWebhook} = req.body
    if (discordWebhook){
      // Destructures the values from the object
      const {unEncryptedWebhook, notify} = discordWebhook

      // For storing the discord webhook data to add to the new monitor document
      // Notify is always false if a webhook is not provided
      const discordWebhookData: EncryptedDiscordWebhookObject = {notify: false}

      // Checks if the unEncryptedWebhook is defined
      if (unEncryptedWebhook){
        // If one is provided, encrypts the webhook and adds it to the new document with notify
        discordWebhookData.encryptedUrl = encryptSymmetricIntoPayload(unEncryptedWebhook)
        discordWebhookData.notify = notify
      }

      // Adds the discord webhook data to the document
      newMonitor.discordWebhook = discordWebhookData
    }

    // Saves the new monitor
    await newMonitor.save()
    res.status(201).json(newMonitor)
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
    res.status(204).json({data: 'Successfuly deleted'})
  } catch (error) {
    logger.error('Error deleting a monitor', error)
    res.status(500).json({error: 'Internal server error'})
  }

})

// Route for modifying the interval or the url string
monitorRouter.patch('/:id', authenticateAndExtractUser, parsePartialMontiorPatchData, async (req: Request<{id: string}, unknown, MonitorPatchData>, res: Response, next: NextFunction) => {
  
  const {id} = req.params

  // Ensures that the id in the request parameters is a valid object id

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
  
  const updateData = buildUpdate<MonitorPatchData>(req.body, ['url', 'interval', 'nickname'], '')

  // Attempts to make the updates and then return the updated monitor
  try {
    const result = await Monitor.findByIdAndUpdate(id, updateData, {new: true, runValidators: true})
    if (!result) {
      res.status(404).json({error: 'monitor not found'})
    }
    res.status(200).json(result)
  } catch (error){
    logger.error('Error updating a monitor: ', error)
    next(error)
  }

})

monitorRouter.patch('/discordWebhook/:id', authenticateAndExtractUser, parseAndProcessDiscordWebhookPatchData, async (req: Request<{id:string}, unknown, ProcessedDiscordWebhookPatchData>, res: Response, next: NextFunction) => {
  // Ensures that the id in the request parameters is a valid object id
  const {id} = req.params
  if (!mongoose.isValidObjectId(req.params.id)){
    res.status(400).json({error: 'Invalid Object ID'})
    return
  }

  // Ensures that the monitor exists
  const monitorToUpdate = await Monitor.findById(id)
  if (!monitorToUpdate){
    res.status(404).json({error: 'Cant find that monitor'})
    return
  }

  const { encryptedUrl, notify } = req.body

  // Ensures that if notify is being updated to true on the discord webhook object, the url is either defined in the update or on the monitor already
  if (notify === true && !encryptedUrl && !monitorToUpdate.discordWebhook?.encryptedUrl){
    res.status(400).json({error: 'Cant turn on notifications for this monitor if no webhook is present'})
    return
  } 

  const update = buildUpdate<ProcessedDiscordWebhookPatchData>(req.body, ['notify', 'encryptedUrl'], 'discordWebhook.')

  try {
    const result = await Monitor.findByIdAndUpdate(id, update, {new: true, runValidators: true})

    if (!result){
      res.status(404).json({error: 'Monitor not found'})
      return
    }

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

// LATER:
// Retrieving all the pings from that monitor

// Must remove all data points associated with a monitor when its deleted

export default monitorRouter