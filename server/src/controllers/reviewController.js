import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import { BOOKING_STATUS } from '../config/constants.js';

export const createReview = async (req, res, next) => {
  try {
    const { hotelId, bookingId, rating, title, comment } = req.body;

    if (!rating || !comment || !bookingId || !hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel, booking reference, rating (1-5), and written comment are required.'
      });
    }

    // 1. Verified stay requirement: Guest must have checked out
    const booking = await Booking.findOne({
      _id: bookingId,
      guestId: req.user._id,
      hotelId,
      status: BOOKING_STATUS.CHECKED_OUT
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: 'Only guests who have completed their stay can submit a verified review.'
      });
    }

    // 2. Prevent duplicate review for the same stay
    const existing = await Review.findOne({
      guestId: req.user._id,
      bookingId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this stay.'
      });
    }

    const review = await Review.create({
      hotelId,
      guestId: req.user._id,
      bookingId,
      rating: Number(rating),
      title: title || '',
      comment,
      status: 'approved'
    });

    res.status(201).json({
      success: true,
      review
    });
  } catch (err) {
    next(err);
  }
};

export const getHotelReviews = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Review.countDocuments({ hotelId, status: 'approved' });
    const reviews = await Review.find({ hotelId, status: 'approved' })
      .populate('guestId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      reviews
    });
  } catch (err) {
    next(err);
  }
};
