import mongoose, { Schema, model, InferSchemaType, HydratedDocument} from 'mongoose'

const monitorSchema = new Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  interval: {
    type: Number,
    default: 5
  },
  lastStatus: {
    type: String,
    enum: ['UP', 'DOWN', 'NOTCHECKED'],
    default: 'NOTCHECKED'
  },
  lastChecked: Date
}, {timestamps: true})

export type MonitorType = InferSchemaType<typeof monitorSchema>
export type MonitorDocument = HydratedDocument<MonitorType>

export default model<MonitorType>('Monitor', monitorSchema)