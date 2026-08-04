import mongoose, { Document, Schema } from 'mongoose'

export interface IActivity extends Document {
  deviceId: mongoose.Types.ObjectId | null
  ownerId: mongoose.Types.ObjectId
  type: string
  description: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  metadata: Record<string, any>
  timestamp: Date
  createdAt: Date
}

const activitySchema = new Schema<IActivity>(
  {
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      default: null,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      default: 'info',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v
        return ret
      },
    },
  }
)

activitySchema.index({ ownerId: 1, timestamp: -1 })
activitySchema.index({ type: 1, timestamp: -1 })

export const Activity = mongoose.model<IActivity>('Activity', activitySchema)
