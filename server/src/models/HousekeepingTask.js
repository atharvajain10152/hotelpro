import mongoose from 'mongoose';
import { HOUSEKEEPING_PRIORITY, HOUSEKEEPING_STATUS } from '../config/constants.js';

const housekeepingTaskSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    priority: {
      type: String,
      enum: Object.values(HOUSEKEEPING_PRIORITY),
      default: HOUSEKEEPING_PRIORITY.MEDIUM
    },
    status: {
      type: String,
      enum: Object.values(HOUSEKEEPING_STATUS),
      default: HOUSEKEEPING_STATUS.PENDING,
      index: true
    },
    notes: {
      type: String,
      default: ''
    },
    scheduledFor: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

housekeepingTaskSchema.index({ hotelId: 1, status: 1 });

export default mongoose.model('HousekeepingTask', housekeepingTaskSchema);

