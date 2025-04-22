import { passwordStrength } from "check-password-strength";


// Method for checking the strength of a password
export const passwordIsStrong = (password: string): boolean => {
  return passwordStrength(password).id >= 1
}

