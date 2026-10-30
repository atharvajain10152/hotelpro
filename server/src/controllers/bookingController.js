import Booking from '../models/Booking.js';
import { BookingService } from '../services/bookingService.js';
import { PaymentService } from '../services/paymentService.js';
import { ROLES, BOOKING_STATUS } from '../config/constants.js';

export const createBookingHold = async (req, res, next) => {
  try {
    const {
      hotelId,
      categoryId,
      checkInDate,
      checkOutDate,
      guests,
      guestSnapshot,
      specialRequests,
      couponCode
    } = req.body;

    const guestId = req.user._id;
    const effectiveSnapshot = guestSnapshot || {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || ''
    };

    const booking = await BookingService.createReservationHold({
      guestId,
      hotelId,
      categoryId,
      checkInDate,
      checkOutDate,
      guests: guests || { adults: 1, children: 0 },
      guestSnapshot: effectiveSnapshot,
      specialRequests,
      couponCode
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { guestId: req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('hotelId', 'name city state images starRating address')
      .populate('categoryId', 'name bedType roomSizeSqFt images')
      .populate('roomId', 'roomNumber floor')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('hotelId', 'name city state address contactEmail contactPhone checkInTime checkOutTime images')
      .populate('categoryId', 'name bedType roomSizeSqFt amenities images')
      .populate('roomId', 'roomNumber floor operationalStatus');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Authorization check: guest owns booking, or authorized staff/manager/admin
    const isOwner = booking.guestId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === ROLES.ADMIN;
    const isHotelStaffOrMgr =
      (req.user.role === ROLES.MANAGER || req.user.role === ROLES.STAFF) &&
      req.user.hotelId?.toString() === booking.hotelId._id.toString();

    if (!isOwner && !isAdmin && !isHotelStaffOrMgr) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this reservation.'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await PaymentService.processRefund({
      bookingId: id,
      user: req.user,
      reason
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getHotelBookings = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { status, date, page = 1, limit = 20 } = req.query;

    const query = { hotelId };
    if (status) query.status = status;

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      query.checkInDate = { $gte: targetDate, $lt: nextDay };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('guestId', 'name email phone')
      .populate('categoryId', 'name basePrice')
      .populate('roomId', 'roomNumber floor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

