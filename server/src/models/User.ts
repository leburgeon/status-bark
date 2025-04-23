import { Schema, model, InferSchemaType, HydratedDocument} from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})

export type UserType = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<UserType>

export default model<UserType>('User', userSchema)