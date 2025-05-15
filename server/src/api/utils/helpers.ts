import { passwordStrength } from "check-password-strength";
import jwt from 'jsonwebtoken'
import config from "../../utils/config.js";

// Method for checking the strength of a password
export const passwordIsStrong = (password: string): boolean => {
  return passwordStrength(password).id >= 1
}

// Method for generating a jsonwebtoken
export const generateJsonWebToken = (email: string, id: string, timeoutInSeconds: number) => {
  return jwt.sign({email, id}, config.JWT_SECRET, {expiresIn: timeoutInSeconds})
}

// Helper function for building a mongoDb update object from a request body
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildUpdate = <T extends object>(input: Partial<T>, allowedFields: (keyof T)[], prefix: string):Record<string, any> => {
  // For storing the values of the update operations for updating and  removing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $set: Record<string, any> = {}
  const $unset: Record<string, 1> = {}

  // Itterates over the keys in the input object
  for (const key of Object.keys(input) as (keyof T)[]){
    // Only handles keys that are in the allowedFields array
    if (!allowedFields.includes(key)) continue
    
    // If the value is null or undefined, adds it to the $unset object
    // Else adds to the set update object
    const value = input[key]
    if (value === undefined || value === null){
      $unset[prefix + String(key)] = 1
    } else {
      $set[prefix + String(key)] = value
    }
  }

  // For storing the update operation objects
  const update: Record<string, Partial<T> | Record<string, 1>> = {}

  // For adding the update operations to the update object
  if (Object.keys($set).length > 0) update.$set = $set
  if (Object.keys($unset).length > 0) update.$unset = $unset

  return update
}