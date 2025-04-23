import { Schema, model, InferSchemaType} from 'mongoose'

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

export type UserDoc = InferSchemaType<typeof userSchema>

export default model<UserDoc>('User', userSchema)