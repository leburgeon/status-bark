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
  nickname: {
    type: String,
    required: true,
    minLength: 3
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

// Inferes the type of the documets returned from this shcema
export type MonitorType = InferSchemaType<typeof monitorSchema>
export type MonitorDocument = HydratedDocument<MonitorType>

// Sets the transformation method on the shcema. 
// This needs to be done after inferring the types as this will modify the returned type
monitorSchema.set('toJSON',
  {transform: (doc, ret) => {
    // Renames the id
    ret.id = doc._id.toString()

    // Removes unncessary
    delete ret._id
    delete ret.__v
    delete ret.updatedAt
    delete ret.discordWebhook._id
    delete ret.user

    // Handles removing the encrypted discord data if defined
    if (ret.discordWebhook.encryptedUrl){
      ret.discordWebhook.urlPresent = true
      delete ret.discordWebhook.encryptedUrl
    } else {
      ret.discordWebhook.urlPresent = false
    }

    // Returns the transformed doc
    return ret
   }
  } 
)

export default model<MonitorType>('Monitor', monitorSchema)

