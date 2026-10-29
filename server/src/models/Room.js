import mongoose from 'mongoose';
import { ROOM_STATUS } from '../config/constants.js';

const roomSchema = new mongoose.Schema(
  {
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
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true
    },
    floor: {
      type: Number,
      default: 1
    },
    operationalStatus: {
      type: String,
      enum: Object.values(ROOM_STATUS),
      default: ROOM_STATUS.CLEAN,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hotelId: 1, operationalStatus: 1 });

export default mongoose.model('Room', roomSchema);
