import mongoose, { Document, Schema } from 'mongoose'

export interface IClientLink extends Document {
  token: string
  ownerId: mongoose.Types.ObjectId
  deviceId: string | null
  isUsed: boolean
  isApproved: boolean
  expiresAt: Date
  usedAt: Date | null
  createdAt: Date
}

const clientLinkSchema = new Schema<IClientLink>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      default: null,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
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

clientLinkSchema.index({ token: 1, isUsed: 1 })

export const ClientLink = mongoose.model<IClientLink>('ClientLink', clientLinkSchema)
