import mongoose, { Schema, model, InferSchemaType, HydratedDocument} from 'mongoose'

// Defines the type of the discord webhook field so that the required function can access the notify field of the webhook object
interface DiscordWebhook {
  notify: boolean,
  encryptedUrl?: string
}

const discordWebhookSchema = new Schema<DiscordWebhook>({
  notify: {
    type:Boolean,
    default: false
  },
  encryptedUrl: {
    type: String,
    required: function () {
      return this.notify === true
    }
  }
}, {id: false})

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
  lastChecked: {
    type: Date,
    default: Date.now
  },
  discordWebhook:{
    type: discordWebhookSchema,
    default: {
      notify: false
    }
  }
}, {timestamps: true})

export type MonitorType = InferSchemaType<typeof monitorSchema>
export type MonitorDocument = HydratedDocument<MonitorType>

export default model<MonitorType>('Monitor', monitorSchema)