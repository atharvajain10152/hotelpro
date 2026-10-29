import express from 'express';
import {
  createBookingHold,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getHotelBookings
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.post('/hold', protect, createBookingHold);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.post('/:id/cancel', protect, cancelBooking);
router.get(
  '/hotel/:hotelId',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  getHotelBookings
);

export default router;
