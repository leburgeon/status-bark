import {test, after, beforeEach, describe} from 'node:test'
import assert from 'node:assert'
import app from '../src/app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import helper from './test_helper.js'
import User from '../src/models/User.js'


const api = supertest(app)

test('app is healthy', async () => {
  await api
    .get('/health')
    .expect(200)
    .expect('Content-Type', /text\/html/)
})



describe('When there are initially some users in the database', () => {
  // Initialises the database with users before each run
  beforeEach(async () => {
    console.log('database ~~~~~')
    await helper.clearUserData()
    await User.insertMany(helper.initialUsers)
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

    test('fails with existing user data', async () => {
      // Attempts to register with existing data
      await api.post('/api/users/register')
        .send(helper.initialUsers[0])
        .expect(400)
      
      // Asserts that the user count has not increased
      const usersInDb = await helper.usersInDb()
      assert.strictEqual(usersInDb.length, helper.initialUsers.length)
    })

  })
})

after(async () => {
  await mongoose.connection.close()
})