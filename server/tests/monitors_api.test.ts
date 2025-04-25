import {test, after, beforeEach, describe} from 'node:test'
import assert from 'node:assert'
import app from '../src/app.js'
import supertest from 'supertest'
import helper from './test_helper.js'
import mongoose from 'mongoose'

const api = supertest(app)

describe('When there are initially some users with monitors in the database', () => {
  beforeEach(async () => {
    await helper.clearUserData()
    await helper.clearMonitorData()
    await helper.addInitialUsersWithMonitors()
    await helper.setLoginToken()
  })

  describe('adding a new monitor...', () => {
    test('works with valid data and login token', async () => {
      const monitorsBefore = await helper.monitorsInDb()

      await api.post('/api/monitors')
        .send(helper.monitorToAdd)
        .auth(helper.loginToken, {type: 'bearer'})
        .expect(201)
      
        const monitorsAfter = await helper.monitorsInDb()
      
      assert.strictEqual(monitorsAfter.length, monitorsBefore.length + 1)
    })
  })



})

after(async () => {
  await mongoose.connection.close()
})