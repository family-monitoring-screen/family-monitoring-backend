import mongoose, { Document, Schema } from 'mongoose'

export interface IScreenshot extends Document {
  deviceId: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId
  imageUrl: string
  thumbnailUrl: string
  fileSize: number
  width: number
  height: number
  capturedAt: Date
  createdAt: Date
}

const screenshotSchema = new Schema<IScreenshot>(
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
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    capturedAt: {
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

screenshotSchema.index({ deviceId: 1, capturedAt: -1 })
screenshotSchema.index({ ownerId: 1, capturedAt: -1 })

export const Screenshot = mongoose.model<IScreenshot>('Screenshot', screenshotSchema)
