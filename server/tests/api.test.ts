import {test, after, beforeEach, describe} from 'node:test'
import assert from 'node:assert'
import app from '../src/api/app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import helper from './test_helper.js'
import jwt from 'jsonwebtoken'
import config from '../src/utils/config.js'

const api = supertest(app)

try {
  await mongoose.connect(config.MONGODB_URL)
} catch (error){
  console.error('Error connecting to database', error)
}

test('app is healthy', async () => {
  await api
    .get('/health')
    .expect(200)
    .expect('Content-Type', /text\/html/)
})

describe('When there are initially some users in the database', () => {
  // Initialises the database with users before each run
  beforeEach(async () => {
    await helper.clearUserData()
    await helper.addInitialUsers()
  })

  describe('adding a new user', () => {

    test('succeeds with valid data', async () => {
      // Registers the new user
      await api.post('/api/users/register')
        .send(helper.userToAdd)
        .expect(201)
      
      // Asserts that the user count has increased
      const usersInDb = await helper.usersInDb()
      assert.strictEqual(usersInDb.length, helper.initialUsers.length + 1)
    })

    describe('fails with', () => {
      test('existing user data', async () => {
        // Attempts to register with existing data
        await api.post('/api/users/register')
          .send(helper.initialUsers[0])
          .expect(400)
        
        // Asserts that the user count has not increased
        const usersInDb = await helper.usersInDb()
        assert.strictEqual(usersInDb.length, helper.initialUsers.length)
      })
    })

    test('a weak password', async () => {
      // Attempts to register a user with a weak password
      await api.post('/api/users/register')
        .send({...helper.userToAdd, password: 'weakshit'})
        .expect(400)

      // Ensures no user was created
      const usersInDb = await helper.usersInDb()
      assert.strictEqual(usersInDb.length, helper.initialUsers.length)
    })

  })


  describe('Logging in', () => {
    test('succeeds with valid user data', async () => {
      const result = await api.post('/api/users/login')
        .send(helper.initialUsers[0])
        .expect(200)
      
      // Ensures that the returned token is valid
      try {
        jwt.verify(result.body.token, config.JWT_SECRET)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error){
        assert(false)
      }
    })

    describe('fails with', () => {
      test('incorrect email', async () => {
        await api.post('/api/users/login')
          .send({email: 'notexist@email.com', password: 'will never know'})
          .expect(401)
      })

      test('incorrect password', async () => {
        await api.post('/api/users/login')
          .send({...helper.initialUsers[0], password: 'wrongpassword'})
          .expect(401)
      })
    })
  })

  describe('and those users have monitors associated with them', () => {
    // Adds the monitors for the users
    beforeEach(async () => {
      await helper.clearMonitorData()
      await helper.addInitialMonitors()
    })

    describe('adding a new monitor...', () => {
      test('works with valid data and login token', async () => {
        const monitorsBefore = await helper.monitorsInDb()

        await api.post('/api/monitors')
          .send(helper.monitorToAdd)
          .auth(await helper.getBearerTokenOfFirstUser(60*60), {type: 'bearer'})
          .expect(201)
        
          const monitorsAfter = await helper.monitorsInDb()
        
        assert.strictEqual(monitorsAfter.length, monitorsBefore.length + 1)
      })

      describe('fails with...', () => {
        test('invalid url', async () => {
          const monitorsBefore = await helper.monitorsInDb()

          const token = await helper.getBearerTokenOfFirstUser(60*60)
    
          await api.post('/api/monitors')
            .send({...helper.monitorToAdd, url: 'invalid'})
            .auth(token, {type: 'bearer'})
            .expect(400)
          
          const monitorsAfter = await helper.monitorsInDb()
          
          assert.strictEqual(monitorsAfter.length, monitorsBefore.length)
        })

        test('invalid or expired token', async () => {
          const monitorsBefore = await helper.monitorsInDb()

          const expiredToken =  await helper.getBearerTokenOfFirstUser(0)

          await api.post('/api/monitors')
            .send(helper.monitorToAdd)
            .auth(expiredToken, {type: 'bearer'})
            .expect(400)

          const monitorsAfter = await helper.monitorsInDb()
        
          assert.strictEqual(monitorsAfter.length, monitorsBefore.length)
        })

        test('duplicate url data', async () => {
          const monitorsBefore = await helper.monitorsInDb()

          const token = await helper.getBearerTokenOfFirstUser(60*60)
    
          await api.post('/api/monitors')
            .send(helper.initialMonitors[0])
            .auth(token, {type: 'bearer'})
            .expect(400)
          
          const monitorsAfter = await helper.monitorsInDb()
          
          assert.strictEqual(monitorsAfter.length, monitorsBefore.length)
        })

        test('an invalid url as the unencrypted discord webhook', async () => {
          const monitorsBefore = await helper.monitorsInDb()

          const token = await helper.getBearerTokenOfFirstUser(60*60)

          const discordWebhook = {
            unEncryptedWebhook: 'invalid',
            notify: true
          }
    
          await api.post('/api/monitors')
            .send({...helper.monitorToAdd, discordWebhook })
            .auth(token, {type: 'bearer'})
            .expect(400)
          
          const monitorsAfter = await helper.monitorsInDb()
          
          assert.strictEqual(monitorsAfter.length, monitorsBefore.length)
        })

        test('an undefined webhook url if notify is true', async () => {
          const monitorsBefore = await helper.monitorsInDb()

          const token = await helper.getBearerTokenOfFirstUser(60*60)

          // The breaking webhook data
          const discordWebhook = {
            notify: true
          }
    
          await api.post('/api/monitors')
            .send({...helper.monitorToAdd, discordWebhook })
            .auth(token, {type: 'bearer'})
            .expect(400)
          
          const monitorsAfter = await helper.monitorsInDb()
          
          assert.strictEqual(monitorsAfter.length, monitorsBefore.length)
        })
      })
    })

    describe('updating monitor info...', () => {

      describe('succeeds when...', () => {

        test('all update data is valid', async () => {
          const monitorToUpdate = await helper.getSpecificFirstUserMonitor()
          const {interval: preInterval, _id: preId, discordWebhook: preDiscordWebhook} = monitorToUpdate
          await api.patch(`/api/monitors/${preId.toString()}`)
            .send(helper.monitorUpdateData)
            .auth(await helper.getBearerTokenOfFirstUser(60*60), {type: 'bearer'})
            .expect(200)
            
          const {interval: postInterval, discordWebhook: postDiscordWebhook} = await helper.getMonitorById(preId.toString())
          // Asserts that the interval has changed
          assert(postInterval !== preInterval)
          // Asserts that the discordWebhook object has changed
          assert.notDeepStrictEqual(postDiscordWebhook, preDiscordWebhook)
        })

        test('attempting to turn off notifications for a webhook', async () =>{
          const monitorToUpdate = await helper.getSpecificFirstUserMonitor()
          const {discordWebhook: {notify: preNotify}} = monitorToUpdate
          await api.patch(`/api/monitors/${monitorToUpdate._id.toString()}`)
            .send({discordWebhook: {notify: false}})
            .auth(await helper.getBearerTokenOfFirstUser(60*60), {type: 'bearer'})
            .expect(200)

          // Retrieves the monitor after the patch
          const {discordWebhook: {notify: postNotify}} = await helper.getMonitorById(monitorToUpdate._id.toString())

          // Asserts that the notify values are different
          assert.notStrictEqual(postNotify, preNotify)
        })

        test('attempting to remove a discord webhook')
      })

      describe('fails when...', () => {
        test('attempting to update another users monitor', async () => {
          const firstUserToken = await helper.getBearerTokenOfFirstUser(60*60)
          const {interval: preInterval, _id: preId} = await helper.getSpecificSecondUserMonitor()
  
          await api.patch(`/api/monitors/${preId.toString()}`)
            .send({interval: '30'})
            .auth(firstUserToken, {type: 'bearer'})
            .expect(401)
  
          const {interval: postInterval, _id: postId} = await helper.getSpecificSecondUserMonitor()
  
          assert.strictEqual(postId.toString(), preId.toString())
          assert.strictEqual(postInterval, preInterval)
        })
  
        test('using an invalid token', async () => {
          const firstUserToken = await helper.getBearerTokenOfFirstUser(0)
          const {interval: preInterval, _id: preId} = await helper.getSpecificFirstUserMonitor()
  
          await api.patch(`/api/monitors/${preId.toString()}`)
            .send(helper.monitorUpdateData)
            .auth(firstUserToken, {type: 'bearer'})
            .expect(400)
  
          const {interval: postInterval, _id: postId} = await helper.getSpecificFirstUserMonitor()
  
          assert.strictEqual(postId.toString(), preId.toString())
          assert.strictEqual(postInterval, preInterval)
        })

        test('attempting to update with invalid interval data', async () => {
          const firstUserToken = await helper.getBearerTokenOfFirstUser(60*60)
          const {interval: preInterval, _id: preId} = await helper.getSpecificFirstUserMonitor()
  
          await api.patch(`/api/monitors/${preId.toString()}`)
            .send({interval: 'invalid'})
            .auth(firstUserToken, {type: 'bearer'})
            .expect(400)
  
          const {interval: postInterval, _id: postId} = await helper.getSpecificFirstUserMonitor()
  
          assert.strictEqual(postId.toString(), preId.toString())
          assert.strictEqual(postInterval, preInterval)
        })

        test.only('attempting to turn on a the notification for a monitor with an undefined url', async () => {
          const firstUserToken = await helper.getBearerTokenOfFirstUser(60*60)
          const {url, interval} = helper.monitorToAdd
          const monitorId = await helper.addMonitorWithDataAsFirstUserAndReturnId({url, interval: parseInt(interval)})

          const {discordWebhook: {notify: preNotify}} = await helper.getMonitorById(monitorId)
  
          await api.patch(`/api/monitors/${monitorId}`)
            .send({discordWebhook:{notify: true}})
            .auth(firstUserToken, {type: 'bearer'})
            .expect(400)
  
          const {discordWebhook: {notify: postNotify}} = await helper.getMonitorById(monitorId)
  
          assert.strictEqual(postNotify, preNotify)
        })
      })
    })

    describe('attempting to delete a monitor...', () => {
      test('succeeds with valid data', async () => {
        const token = await helper.getBearerTokenOfFirstUser(60*60)
        const monitorToDelete = await helper.getSpecificFirstUserMonitor()

        const monitorsBefore = await helper.monitorsInDb()

        await api.delete(`/api/monitors/${monitorToDelete._id.toString()}`)
          .auth(token, {type: 'bearer'})
          .expect(410)

        const monitorsAfter = await helper.monitorsInDb()
        assert.strictEqual(monitorsAfter.length, monitorsBefore.length - 1)
      })

      test('fails and returns 401 when attempting to delete another users monitor', async () => {
        const token = await helper.getBearerTokenOfFirstUser(60*60)
        const monitorToDelete = await helper.getSpecificSecondUserMonitor()

        const monitorsBefore = await helper.monitorsInDb()

        await api.delete(`/api/monitors/${monitorToDelete._id.toString()}`)
          .auth(token, {type: 'bearer'})
          .expect(401)

        const monitorsAfter = await helper.monitorsInDb()
        assert.strictEqual(monitorsAfter.length, monitorsBefore.length)
      })

      test('returns correct status and error with invalid object id', async () => {
        const token = await helper.getBearerTokenOfFirstUser(60*60)

        await api.delete('/api/monitors/123456788ghgh')
          .auth(token, {type: 'bearer'})
          .expect(400)
      })
    })

  })
})

after(async () => {
  await mongoose.connection.close()
})