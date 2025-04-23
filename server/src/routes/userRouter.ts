import express, {NextFunction, Request, Response} from 'express'
import { LoginCredentials, NewUser } from '../types/types.js'
import User from '../models/User.js'
import { parseLoginCredentials, parseNewUser } from '../utils/middlewear.js'
import { passwordIsStrong } from '../utils/helpers.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../utils/config.js'

const userRouter = express.Router()

// Route for registering as a new user
userRouter.post('/register', parseNewUser, async (req: Request<unknown, unknown, NewUser>, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  // Ensures that the user does not already exist
  const exists = await User.findOne({email})

  // Returns error response if a user with that email exists already
  if (exists) {
    res.status(400).json({error: 'User with that email already exists'})
    return 
  }

  // Returns error response if the password is too weak
  if (!passwordIsStrong(password)){
    res.status(400).json({erro: 'Password must contain upper and lower case values, and be 8 characters long'})
    return
  }

  // Attempts to create the new user
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({email, passwordHash})
    await newUser.save()
    res.status(201).json({data: 'Account created!'})
    return
  } catch (error) {
    next(error)
  }
})

// TODO: route for logging in and authenticating
userRouter.post('/login', parseLoginCredentials, async (req: Request<unknown, unknown, LoginCredentials>, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  // Finds the user with that email
  const user = await User.findOne({email})

  // Returns an error if the email is not found or the password does not match the hash
  if (!user || !await bcrypt.compare(password, user.passwordHash)){
    res.status(401).json({error: 'The email/password combination was not correct'})
    return
  }

  // Generates a JWT and returns it
  const token = jwt.sign({email}, config.JWT_SECRET, {expiresIn: 60 * 60})
  res.status(200).json({token})
})

// TODO: Route for deleting a user
  // Must delele all associated user data

export default userRouter