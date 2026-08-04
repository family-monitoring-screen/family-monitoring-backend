import mongoose, { Document, Schema } from 'mongoose'

export interface IDevice extends Document {
  deviceId: string
  name: string
  model: string
  os: string
  osVersion: string
  batteryLevel: number
  status: 'online' | 'offline'
  ipAddress: string | null
  ownerId: mongoose.Types.ObjectId
  fcmToken: string | null
  isApproved: boolean
  isConnected: boolean
  lastSyncAt: Date | null
  lastLocationUpdate: Date | null
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const deviceSchema = new Schema<IDevice>(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
    osVersion: {
      type: String,
      default: 'Unknown',
    },
    batteryLevel: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
      index: true,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    lastSyncAt: {
      type: Date,
      default: null,
    },
    lastLocationUpdate: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
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

deviceSchema.index({ ownerId: 1, status: 1 })
deviceSchema.index({ deviceId: 1 })

export const Device = mongoose.model<IDevice>('Device', deviceSchema)
