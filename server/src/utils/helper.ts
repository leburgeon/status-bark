import crypto from 'crypto'
import config from './config.js'

// For combining the encrypted cipher elements into a payload
const combineEncryptedPayload = (iv: Buffer, tag: Buffer, ciphertext: Buffer) => {
  const payload = Buffer.concat([iv, tag, ciphertext]).toString('base64')
  return payload
}

// For seperating the encrypted payload into the buffer elements
const seperateEncryptedPayload = (payload: string): {iv: Buffer, tag: Buffer, ciphertext: Buffer} => {
  const encryptedBuffer = Buffer.from(payload, 'base64')

  const iv = encryptedBuffer.subarray(0, 12)
  const tag = encryptedBuffer.subarray(12, 28)
  const ciphertext = encryptedBuffer.subarray(28)

  return {iv, tag, ciphertext}
}

export const encryptSymmetricIntoPayload = (webhook: string): string => {
  // Creates the iv to be at the start of the encryption blocks, ensuring uniqueness
  const iv = crypto.randomBytes(12)

  // Creates the cipher, using the key and the iv
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(config.WEBHOOK_ENCRYPTION_KEY, 'base64'), iv)

  // Updates the created cipher with the webhook to encrypt and the encoding
  let ciphertext = cipher.update(webhook, 'utf-8', 'base64')

  // Finalises the encryption
  ciphertext += cipher.final('base64')

  // Gets the auth tag for the encryption
  const tag = cipher.getAuthTag()

  // Combines and returns the payload
  const payload = combineEncryptedPayload(iv, tag, Buffer.from(ciphertext, 'base64'))
  return payload
}

export const decryptDiscordWebhookPayload = (encryptedPayload: string): string => {
  // Seperates the elements for decryption from the payload
  const {iv, tag, ciphertext} = seperateEncryptedPayload(encryptedPayload)

  // Creates the decypher object using the key and the initialisation vector
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(config.WEBHOOK_ENCRYPTION_KEY, 'base64'), iv)

  // Sets the authorisation tag
  decipher.setAuthTag(tag)

  // Decrypts the ciphertext
  let plaintext = decipher.update(ciphertext.toString('base64'), 'base64', 'utf-8')

  // Finalises the decryption
  plaintext += decipher.final('base64')

  return plaintext
}