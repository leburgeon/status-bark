import {test, after, beforeEach} from 'node:test'
import app from '../src/app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import helper from './test_helper.js'

const api = supertest(app)

// Initialises the database before running tests
beforeEach(async () => {
  await helper.clearUserData()
  const firstUser = 
})

test('app is healthy', async () => {
  await api
    .get('/health')
    .expect(200)
    .expect('Content-Type', /text\/html/)
})

after(async () => {
  await mongoose.connection.close()
})