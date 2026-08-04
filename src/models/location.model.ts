import mongoose, { Document, Schema } from 'mongoose'

export interface ILocation extends Document {
  deviceId: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId
  latitude: number
  longitude: number
  accuracy: number
  speed: number | null
  altitude: number | null
  bearing: number | null
  provider: 'gps' | 'network' | 'passive'
  timestamp: Date
  createdAt: Date
}

const locationSchema = new Schema<ILocation>(
  {
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
      default: 0,
    },
    speed: {
      type: Number,
      default: null,
    },
    altitude: {
      type: Number,
      default: null,
    },
    bearing: {
      type: Number,
      default: null,
    },
    provider: {
      type: String,
      enum: ['gps', 'network', 'passive'],
      default: 'gps',
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

locationSchema.index({ deviceId: 1, timestamp: -1 })
locationSchema.index({ latitude: 1, longitude: 1 })

export const Location = mongoose.model<ILocation>('Location', locationSchema)
