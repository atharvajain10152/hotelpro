import Booking from '../models/Booking.js';
import RoomCategory from '../models/RoomCategory.js';
import Room from '../models/Room.js';
import { PricingService } from './pricingService.js';
import { BOOKING_STATUS, HOLD_EXPIRATION_MINUTES } from '../config/constants.js';

export class BookingService {
  /**
   * Helper to clean expired temporary reservation holds
   */
  static async releaseExpiredHolds() {
    const now = new Date();
    await Booking.updateMany(
      {
        status: BOOKING_STATUS.PENDING_PAYMENT,
        holdExpiresAt: { $lt: now }
      },
      {
        $set: { status: BOOKING_STATUS.EXPIRED }
      }
    );
  }

  /**
   * Check category availability for half-open interval [checkIn, checkOut)
   */
  static async checkCategoryAvailability({ hotelId, categoryId, checkInDate, checkOutDate }) {
    await this.releaseExpiredHolds();

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      throw new Error('Check-out date must be strictly after check-in date.');
    }

    const category = await RoomCategory.findById(categoryId);
    if (!category) {
      throw new Error('Room category not found.');
    }

    // Count physical active rooms under this category
    const physicalRoomCount = await Room.countDocuments({
      hotelId,
      categoryId,
      isActive: true
    });

    const totalCapacity = physicalRoomCount > 0 ? physicalRoomCount : category.totalRooms || 5;

    // Active overlapping bookings: status is confirmed/checked_in OR pending with valid hold
    const overlappingBookingsCount = await Booking.countDocuments({
      hotelId,
      categoryId,
      status: {
        $in: [
          BOOKING_STATUS.CONFIRMED,
          BOOKING_STATUS.CHECKED_IN,
          BOOKING_STATUS.PENDING_PAYMENT
        ]
      },
      $and: [
        { checkInDate: { $lt: end } },
        { checkOutDate: { $gt: start } },
        {
          $or: [
            { status: { $ne: BOOKING_STATUS.PENDING_PAYMENT } },
            { holdExpiresAt: { $gt: new Date() } }
          ]
        }
      ]
    });

    const availableRooms = Math.max(0, totalCapacity - overlappingBookingsCount);

    return {
      isAvailable: availableRooms > 0,
      availableRooms,
      totalCapacity,
      category
    };
  }

  /**
   * Find an unreserved physical room to assign to a booking
   */
  static async assignPhysicalRoom({ hotelId, categoryId, checkInDate, checkOutDate }) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // Find all active rooms in category
    const rooms = await Room.find({ hotelId, categoryId, isActive: true });
    if (!rooms.length) return null;

    // Find room IDs already booked in this date interval
    const bookedRoomIds = await Booking.find({
      hotelId,
      categoryId,
      roomId: { $ne: null },
      status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CHECKED_IN] },
      checkInDate: { $lt: end },
      checkOutDate: { $gt: start }
    }).distinct('roomId');

    const availableRoom = rooms.find(
      (r) => !bookedRoomIds.some((bookedId) => bookedId.toString() === r._id.toString())
    );

    return availableRoom || null;
  }

  /**
   * Create a reservation hold
   */
  static async createReservationHold({
    guestId,
    hotelId,
    categoryId,
    checkInDate,
    checkOutDate,
    guests,
    guestSnapshot,
    specialRequests = '',
    couponCode = ''
  }) {
    // Check availability first
    const { isAvailable, category } = await this.checkCategoryAvailability({
      hotelId,
      categoryId,
      checkInDate,
      checkOutDate
    });

    if (!isAvailable) {
      throw new Error('Sorry, no rooms are available in this category for the selected dates.');
    }

    // Verify guest capacity
    const totalGuests = (guests.adults || 1) + (guests.children || 0);
    if (totalGuests > category.capacity.maxGuests) {
      throw new Error(
        `Selected room category accommodates a maximum of ${category.capacity.maxGuests} guests.`
      );
    }

    // Calculate authoritative pricing
    const pricingBreakdown = PricingService.calculatePricing({
      basePrice: category.basePrice,
      checkInDate,
      checkOutDate,
      adults: guests.adults || 1,
      children: guests.children || 0,
      couponCode
    });

    // Generate unique booking reference e.g. HP-89412-A7B
    const uniqueSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const timestampSuffix = Date.now().toString().slice(-5);
    const bookingReference = `HP-${timestampSuffix}-${uniqueSuffix}`;

    // Hold expiry (15 mins)
    const holdExpiresAt = new Date(Date.now() + HOLD_EXPIRATION_MINUTES * 60 * 1000);

    // Attempt to assign physical room if available
    const physicalRoom = await this.assignPhysicalRoom({
      hotelId,
      categoryId,
      checkInDate,
      checkOutDate
    });

    const booking = await Booking.create({
      bookingReference,
      guestId,
      hotelId,
      categoryId,
      roomId: physicalRoom ? physicalRoom._id : null,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      nights: pricingBreakdown.nights,
      guests,
      status: BOOKING_STATUS.PENDING_PAYMENT,
      pricingBreakdown,
      guestSnapshot,
      specialRequests,
      holdExpiresAt
    });

    return booking;
  }
}

