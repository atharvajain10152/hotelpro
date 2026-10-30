import mongoose from 'mongoose';

const roomCategorySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Hotel reference is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Room category name is required'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Room description is required']
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price per night is required'],
      min: [0, 'Base price cannot be negative'],
      index: true
    },
    capacity: {
      adults: {
        type: Number,
        required: true,
        default: 2,
        min: 1
      },
      children: {
        type: Number,
        default: 1,
        min: 0
      },
      maxGuests: {
        type: Number,
        required: true,
        default: 3
      }
    },
    bedType: {
      type: String,
      enum: ['King Bed', 'Queen Bed', 'Twin Beds', 'Double Suite'],
      default: 'King Bed'
    },
    roomSizeSqFt: {
      type: Number,
      default: 450
    },
    amenities: {
      type: [String],
      default: [
        'Balcony with Panoramic View',
        'Smart 55" 4K TV',
        'Nespresso Coffee Machine',
        'Luxury Rain Shower & Bathtub',
        'Mini-Bar & Safe',
        'Ergonomic Work Desk',
        'High-Speed Wi-Fi'
      ]
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
      ]
    },
    totalRooms: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true
  }
);

roomCategorySchema.index({ hotelId: 1, basePrice: 1 });

export default mongoose.model('RoomCategory', roomCategorySchema);

