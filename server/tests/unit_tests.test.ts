import { test } from 'node:test'
import { encryptSymmetricIntoPayload, decryptSymmetricFromPayload } from '../src/utils/helper.js'
import crypto from 'crypto'
import assert from 'node:assert'

test.only('encryption and decryption functions work as exepected', () => {
  const randomString = crypto.randomBytes(22).toString('utf-8')
  const encryptedPayload = encryptSymmetricIntoPayload(randomString)
  const decrypted = decryptSymmetricFromPayload(encryptedPayload)
  assert.strictEqual(decrypted, randomString)
})