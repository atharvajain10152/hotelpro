import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../config/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking reference is required'],
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
      required: [true, 'Hotel reference is required']
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    provider: {
      type: String,
      enum: ['mock', 'stripe', 'razorpay'],
      default: 'mock'
    },
    orderId: {
      type: String,
      default: ''
    },
    paymentId: {
      type: String,
      default: ''
    },
    signature: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ guestId: 1, createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);

