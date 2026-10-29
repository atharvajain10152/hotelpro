import express from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel
} from '../controllers/hotelController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/', protect, authorize(ROLES.ADMIN, ROLES.MANAGER), createHotel);
router.put('/:id', protect, authorize(ROLES.ADMIN, ROLES.MANAGER), updateHotel);

export default router;
