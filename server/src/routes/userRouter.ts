import express, {NextFunction, Request, Response} from 'express'
import { NewUser } from '../types.js'
import User from '../models/User.js'
import { parseNewUser } from '../utils/middlewear.js'
import { passwordIsStrong } from '../utils/helpers.js'
import bcrypt from 'bcryptjs'

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

// TODO: Route for deleting a user
  // Must delele all associated user data

export default userRouter