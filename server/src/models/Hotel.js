import mongoose from 'mongoose';
import { HOTEL_STATUS } from '../config/constants.js';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
      maxlength: [150, 'Hotel name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Hotel description is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    },
    postalCode: {
      type: String,
      trim: true
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    contactEmail: {
      type: String,
      trim: true
    },
    contactPhone: {
      type: String,
      trim: true
    },
    amenities: {
      type: [String],
      default: [
        'Free High-Speed Wi-Fi',
        'Swimming Pool',
        'Fitness Center & Gym',
        'Fine Dining Restaurant',
        '24/7 Room Service',
        'Spa & Wellness Retreat',
        'Airport Transfers',
        'Valet Parking'
      ]
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    status: {
      type: String,
      enum: Object.values(HOTEL_STATUS),
      default: HOTEL_STATUS.ACTIVE,
      index: true
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    checkInTime: {
      type: String,
      default: '14:00'
    },
    checkOutTime: {
      type: String,
      default: '11:00'
    },
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 48 hours prior to check-in. Non-refundable thereafter.'
    },
    tagline: {
      type: String,
      trim: true,
      default: 'An Iconic Luxury Sanctuary Offering Timeless Elegance & Impeccable Hospitality'
    },
    highlights: {
      type: [String],
      default: [
        'Bayview Infinity Pool & Private Cabanas',
        '24/7 Dedicated Butler Service',
        'Michelin-Curated Fine Dining & High Tea',
        'Heritage Ayurvedic Spa & Thermal Suites',
        'Private Luxury Airport Limousine Transfers'
      ]
    },
    dining: [
      {
        name: { type: String, required: true },
        cuisine: { type: String, default: 'Multi-Cuisine Fine Dining' },
        hours: { type: String, default: '07:00 - 23:30' },
        dressCode: { type: String, default: 'Smart Casual' },
        description: { type: String, default: '' },
        image: { type: String, default: '' }
      }
    ],
    wellness: {
      title: { type: String, default: 'Signature Wellness & Spa Retreat' },
      description: {
        type: String,
        default: 'Rejuvenate your senses with bespoke holistic therapies, ancient wellness traditions, and modern restorative treatments.'
      },
      hours: { type: String, default: '06:00 - 22:00' },
      facilities: {
        type: [String],
        default: ['Ayurvedic Treatment Suites', 'Heated Hydrotherapy Pool', 'Steam & Sauna Lounges', 'Technogym Fitness Studio', 'Outdoor Yoga Deck']
      }
    },
    policies: {
      checkInTime: { type: String, default: '14:00' },
      checkOutTime: { type: String, default: '11:00' },
      cancellationPolicy: { type: String, default: 'Free cancellation up to 48 hours prior to arrival.' },
      petPolicy: { type: String, default: 'Pets welcome upon prior request in selected villas and ground-floor suites.' },
      smokingPolicy: { type: String, default: '100% Smoke-Free indoor sanctuary. Designated outdoor smoking lounges available.' },
      childPolicy: { type: String, default: 'Children under 6 years stay complimentary when sharing existing suite bedding.' },
      depositPolicy: { type: String, default: 'A valid government photo ID and credit card guarantee are required at check-in.' }
    },
    nearbyAttractions: [
      {
        name: { type: String, required: true },
        distance: { type: String, required: true },
        category: { type: String, default: 'Attraction' },
        description: { type: String, default: '' }
      }
    ],
    propertyDetails: {
      yearBuilt: { type: Number, default: 1903 },
      architecturalStyle: { type: String, default: 'Heritage Palace & Classical Grandeur' },
      totalFloors: { type: Number, default: 7 },
      totalRooms: { type: Number, default: 150 },
      airportDistance: { type: String, default: '24 km from International Airport' }
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Pre-save to auto-generate slug if not provided
hotelSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
  }
  next();
});

export default mongoose.model('Hotel', hotelSchema);

