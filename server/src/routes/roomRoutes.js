import express from 'express';
import {
  getCategoriesByHotel,
  checkAvailability,
  createCategory,
  updateCategory,
  getRooms,
  createRoom,
  updateRoomStatus
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/hotel/:hotelId/categories', getCategoriesByHotel);
router.get('/hotel/:hotelId/category/:categoryId/availability', checkAvailability);
router.post(
  '/hotel/:hotelId/category',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  createCategory
);
router.put(
  '/category/:categoryId',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  updateCategory
);

router.get('/hotel/:hotelId/inventory', protect, authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), getRooms);
router.post('/hotel/:hotelId/rooms', protect, authorize(ROLES.ADMIN, ROLES.MANAGER), createRoom);
router.patch(
  '/rooms/:roomId/status',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  updateRoomStatus
);

export default router;
