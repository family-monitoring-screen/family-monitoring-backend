import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  firebaseUid: string
  email: string
  displayName: string | null
  photoURL: string | null
  role: 'admin' | 'viewer'
  isActive: boolean
  refreshToken: string | null
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      default: null,
    },
    photoURL: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'viewer'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.refreshToken
        delete ret.__v
        return ret
      },
    },
  }
)

userSchema.index({ email: 1 })
userSchema.index({ firebaseUid: 1 })

export const User = mongoose.model<IUser>('User', userSchema)
