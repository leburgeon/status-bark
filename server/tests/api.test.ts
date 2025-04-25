import {test, after, beforeEach, describe} from 'node:test'
import assert from 'node:assert'
import app from '../src/app.js'
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
          .auth(await helper.getBearerToken(), {type: 'bearer'})
          .expect(201)
        
          const monitorsAfter = await helper.monitorsInDb()
        
        assert.strictEqual(monitorsAfter.length, monitorsBefore.length + 1)
      })

      // describe('fails with...', () => {
      //   test('invalid url', async () => {
      //     const monitorsBefore = await helper.monitorsInDb()

      //     await helper.setLoginToken()
    
      //     await api.post('/api/monitors')
      //       .send({url: 'invalid', })
      //       .auth(helper.loginToken, {type: 'bearer'})
      //       .expect(201)
          
      //       const monitorsAfter = await helper.monitorsInDb()
          
      //     assert.strictEqual(monitorsAfter.length, monitorsBefore.length + 1)
      //   })
      // })
    })


  })
})

after(async () => {
  await mongoose.connection.close()
})