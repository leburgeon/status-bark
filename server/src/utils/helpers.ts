import { passwordStrength } from "check-password-strength";
import jwt from 'jsonwebtoken'
import config from "./config.js";

// Method for checking the strength of a password
export const passwordIsStrong = (password: string): boolean => {
  return passwordStrength(password).id >= 1
}

// Method for generating a jsonwebtoken
export const generateJsonWebToken = (email: string, timeoutInSeconds: number) => {
  return jwt.sign({email}, config.JWT_SECRET, {expiresIn: timeoutInSeconds})
}

