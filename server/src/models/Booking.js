import mongoose from 'mongoose';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../config/constants.js';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guest reference is required'],
      index: true
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Hotel reference is required'],
      index: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomCategory',
      required: [true, 'Room category reference is required'],
      index: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
      index: true
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
      index: true
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
      index: true
    },
    nights: {
      type: Number,
      required: true,
      min: 1
    },
    guests: {
      adults: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      children: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING_PAYMENT,
      index: true
    },
    pricingBreakdown: {
      baseNightlyRate: { type: Number, required: true },
      nights: { type: Number, required: true },
      roomSubtotal: { type: Number, required: true },
      extraGuestFee: { type: Number, default: 0 },
      taxesAndFees: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true
    },
    guestSnapshot: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' }
    },
    specialRequests: {
      type: String,
      default: ''
    },
    holdExpiresAt: {
      type: Date,
      index: true
    },
    checkedInAt: {
      type: Date,
      default: null
    },
    checkedOutAt: {
      type: Date,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancellationReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast availability calculations and search
bookingSchema.index({ hotelId: 1, categoryId: 1, status: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ roomId: 1, status: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ guestId: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
