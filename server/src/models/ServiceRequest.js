import mongoose from 'mongoose';
import { SERVICE_REQUEST_STATUS, SERVICE_REQUEST_TYPES } from '../config/constants.js';

const serviceRequestSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null
    },
    requestType: {
      type: String,
      enum: SERVICE_REQUEST_TYPES,
      required: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: Object.values(SERVICE_REQUEST_STATUS),
      default: SERVICE_REQUEST_STATUS.SUBMITTED,
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolutionNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

serviceRequestSchema.index({ hotelId: 1, status: 1 });
serviceRequestSchema.index({ guestId: 1, createdAt: -1 });

export default mongoose.model('ServiceRequest', serviceRequestSchema);

